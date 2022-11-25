import { autoinject, observable } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { ApiClient } from "shared/infrastructure";
import { ToastService, Toast } from "shared/framework";
import { NotificationToast } from "../../toasts/notification/notification";
import { Notification } from "./notification";
import settings from "resources/settings";

/**
 * Represents a service for managing user notifications.
 */
@autoinject
export class NotificationService
{
    /**
     * Creates a new instance of the type.
     * @param apiClient The `ApiClient` instance.
     * @param toastService The `ToastService` instance.
     */
    public constructor(apiClient: ApiClient, toastService: ToastService)
    {
        this._apiClient = apiClient;
        this._toastService = toastService;
    }

    private readonly _apiClient: ApiClient;
    private readonly _toastService: ToastService;
    private _pollingIntervalHandle: any;
    private _fetchNewerOperation: Operation | undefined;
    private _fetchOlderOperation: Operation | undefined;
    private _markOperation: Operation | undefined;

    /**
     * The total number of unseen notifications, or undefined if the service has never started.
     * Note that this includes all notifications, not just the notifications that have been fetched.
     */
    @observable
    public unseenCount: number | undefined;

    /**
     * The list of recent notifications, ordered by descending date,
     * or undefined if recent notifications have not been fetched.
     */
    public notifications: Notification[] | undefined;

    /**
     * Starts polling for new notifications.
     */
    public start(): void
    {
        this.stop();

        // Only fetch a few of the newest notifications in the initial request.
        this.fetchNewer(10, false)
            .catch(error => console.error(error));

        // Start polling for new notifications.
        this._pollingIntervalHandle = setInterval(() =>
        {
            // Don't fetch if a fetch newer operation is already pending.
            if (!this._fetchNewerOperation?.pending)
            {
                // Did the initial fetch fail?
                if (this.notifications == null)
                {
                    // Only fetch a few of the newest notifications in the initial request.
                    this.fetchNewer(10, false)
                        .catch(error => console.error(error));
                }
                else
                {
                    // Fetch new notifications, and present them as toasts.
                    this.fetchNewer(settings.app.notifications.pageSize, true)
                        .catch(error => console.error(error));
                }
            }

        }, settings.app.notifications.refreshInterval);
    }

    /**
     * Stops polling for new notifications.
     */
    public stop(): void
    {
        // Abort any pending fetch newer operations.
        this._fetchNewerOperation?.abort();
        this._fetchNewerOperation = undefined;

        // Abort any pending fetch older operations.
        this._fetchOlderOperation?.abort();
        this._fetchOlderOperation = undefined;

        // Stop polling.
        clearInterval(this._pollingIntervalHandle);
        this._pollingIntervalHandle = undefined;

        // Reset state.
        this.unseenCount = undefined;
        this.notifications = undefined;
    }

    /**
     * Marks the specified notifications as seen.
     * @param notifications The notifications to mark as seen, or undefined to mark all notifications as seen.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    public async markAsSeen(notifications?: Notification[]): Promise<void>
    {
        this._markOperation = new Operation(async signal =>
        {
            let toastsToClose: Toast[] | undefined;

            if (notifications != null)
            {
                // Ignore notifications that are already marked as seen.
                const unseenNotifications = notifications.filter(n => !n.seen);

                // Mark the notifications as seen.

                await this._apiClient.post("notifications/seen",
                {
                    body: { ids: unseenNotifications }
                });

                for (const notification of unseenNotifications)
                {
                    this.markNotificationAsSeen(notification);
                }

                // Find any toasts associated with the notifications.
                toastsToClose = this._toastService.toasts
                    .filter(toast => toast.model instanceof Notification && unseenNotifications.some(n => n.id === toast.model.id));
            }
            else
            {
                // Get the created date and time of the newest notification currently in the list, if any.
                const newestCreatedDateTime = this.notifications?.[0]?.createdDateTime;

                // Mark all notifications as seen.

                await this._apiClient.post("notifications/seen",
                {
                    body: { before: newestCreatedDateTime?.plus({ millisecond: 1 }) }
                });

                if (this.notifications != null)
                {
                    for (const notification of this.notifications)
                    {
                        notification.seen = true;
                    }
                }

                // Reset the unseen count.
                if (this.unseenCount != null)
                {
                    this.unseenCount = 0;
                }

                // Find any toasts associated with notifications.
                toastsToClose = this._toastService.toasts
                    .filter(toast => toast.model instanceof Notification);
            }

            // Close the toasts, ordered by ascending created date.
            if (toastsToClose != null)
            {
                for (const toast of toastsToClose.reverse())
                {
                    await toast.close("marked-as-seen");
                }
            }
        });

        return this._markOperation.promise;
    }

    /**
     * Fetches the specified number of recent notifications, that are older than the oldest notification currently in the list.
     * @param limit The max number of notifications to get.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    public async fetchOlder(limit = settings.app.notifications.pageSize): Promise<void>
    {
        // If a fetch older operation is already pending, abort it.
        this._fetchOlderOperation?.abort();

        // If the initial fetch newer operation is still pending, abort it.
        if (this.notifications == null)
        {
            this._fetchNewerOperation?.abort();
        }

        this._fetchOlderOperation = new Operation(async signal =>
        {
            // Get the created date and time of the newest notification currently in the list, if any.
            const oldestCreatedDateTime = this.notifications?.[this.notifications.length - 1]?.createdDateTime;

            // Get the older notifications, ordered by descending created date.

            const result = await this._apiClient.get("notifications",
            {
                query: { before: oldestCreatedDateTime, limit },
                signal
            });

            const notifications = result.data.notifications.map((data: any) => new Notification(data));

            // Wait for any pending mark operation to end,
            await this._markOperation?.promise.catch(() => undefined);

            // Create the notifications list, if needed.
            if (this.notifications == null)
            {
                this.notifications = [];
            }

            // Process the notifications, ordered by descending created date.
            for (const notification of notifications)
            {
                // Update the notification in the list, if found.
                if (!this.updateExistingNotification(notification))
                {
                    // Append the notification to the list.
                    this.notifications.push(notification);
                }
            }
        });

        await this._fetchOlderOperation.promise;
    }

    /**
     * Fetches notifications that are newer than the newest notification currently in the list.
     * @param limit The max number of notifications to fetch.
     * @param notify True to present unseen notifications with as toasts, otherwise false.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    protected async fetchNewer(limit: number, notify: boolean): Promise<void>
    {
        // If a fetch newer operation is already pending, abort it.
        this._fetchNewerOperation?.abort();

        this._fetchNewerOperation = new Operation(async signal =>
        {
            // Get the ID of the newest notification currently in the list, if any.
            const newestCreatedDateTime = this.notifications?.[0]?.createdDateTime;

            // Get the newer notifications, ordered by descending created date.

            const result = await this._apiClient.get("notifications",
            {
                query: { after: newestCreatedDateTime, limit },
                signal
            });

            const notifications = result.data.notifications.map((data: any) => new Notification(data));

            // Wait for any pending mark operation to end,
            await this._markOperation?.promise.catch(() => undefined);

            // Update the unseen count.
            this.unseenCount = result.data.unseenCount;

            // Create the notifications list, if needed.
            if (this.notifications == null)
            {
                this.notifications = [];
            }

            // Process the notifications, ordered by ascending created date.
            for (const notification of notifications.slice().reverse())
            {
                // Update the notification in the list, if found.
                if (!this.updateExistingNotification(notification))
                {
                    // Prepend the notification to the list.
                    this.notifications.unshift(notification);
                }

                // If the notification is unseen, notify the user with a toast.
                if (notify && !notification.seen)
                {
                    // tslint:disable-next-line: no-floating-promises
                    this._toastService.open(NotificationToast, notification).promise.then(seen =>
                    {
                        // Did the user dismiss the toast?
                        if (seen)
                        {
                            // Mark the notification as seen.
                            this.markNotificationAsSeen(notification);
                        }
                    });
                }
            }
        });

        await this._fetchNewerOperation.promise;
    }

    /**
     * Called by the framework when the `unseenCount` property changes.
     * Updates the app badge to show the unseen count.
     */
    protected unseenCountChanged(): void
    {
        // TODO: Remove this if Electron gets support for the standard API.
        // See: https://github.com/electron/electron/issues/25141
        // Update the notification badge, if supported.
        if (ENVIRONMENT.platform === "desktop")
        {
            window.ipc?.send("set-app-badge", { value: this.unseenCount });
        }
        else
        {
            this.unseenCount
                ? navigator.setAppBadge?.(this.unseenCount)
                : navigator.clearAppBadge?.();
        }
    }

    /**
     * Attempts to update the specified notification in the list, if found.
     * @param notification The notification to update in the list.
     * @returns True if the notification was found in the list, otherwise false.
     */
    private updateExistingNotification(notification: Notification): boolean
    {
        // Try to find the notification in the list.
        const existingNotification = this.notifications?.find(n => n.id === notification.id);

        if (existingNotification != null)
        {
            if (!existingNotification.seen && notification.seen)
            {
                // Mark the notification as seen.
                notification.seen = true;

                if (this.unseenCount != null)
                {
                    // Decrement the unseen count.
                    this.unseenCount--;
                }
            }

            return true;
        }

        return false;
    }

    /**
     * Marks the specified notification as seen, and updates the notification in the list, if found.
     * @param notification The notification to mark as seen.
     */
    private markNotificationAsSeen(notification: Notification): void
    {
        // Try to find the notification in the list.
        const existingNotification = this.notifications?.find(n => n.id === notification.id);

        if (existingNotification != null && !existingNotification.seen)
        {
            // Mark the notifications as seen.
            existingNotification.seen = true;

            if (this.unseenCount != null)
            {
                // Decrement the unseen count.
                this.unseenCount--;
            }
        }

        // Mark the notifications as seen.
        notification.seen = true;
    }
}
