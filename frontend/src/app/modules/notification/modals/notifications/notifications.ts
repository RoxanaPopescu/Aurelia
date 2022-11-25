import { autoinject, computedFrom } from "aurelia-framework";
import { groupItems } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { NotificationService, Notification } from "../../services/notification";

/**
 * Represents the global `notifications` modal panel.
 * This allows the user to see, and react to, personalized notifications.
 */
@autoinject
export class NotificationsModalPanel
{
    /**
     * Creates a new instance of the type.
     * @param notificationService The `NotificationService` instance.
     */
    public constructor(notificationService: NotificationService)
    {
        this.notificationService = notificationService;
    }

    /**
     * The position of the panel.
     */
    protected position = document.documentElement.classList.contains("theme-enable-topbar") ? "right" : "left";

    /**
     * The `NotificationService` instance.
     */
    protected readonly notificationService: NotificationService;

    /**
     * The notifications, grouped by localized, relative calendar time.
     */
    @computedFrom("notificationService.notifications.length")
    protected get groupedNotifications(): Map<string, Notification[]> | undefined
    {
        if (this.notificationService.notifications == null)
        {
            return undefined;
        }

        return groupItems(this.notificationService.notifications, n => n.createdDateTime.toRelativeCalendar()!);
    }

    /**
     * Called by the framework when the modal is activating.
     */
    public activate(): void
    {
        // Start async tasks.

        this.notificationService.fetchOlder()
            .catch(error => Log.error(error));
    }

    /**
     * Called when the scroll sentinel intersects the bottom of the viewport.
     * Fetches the latest, or older, notifications.
     */
    protected async onScrollSentinelIntersect(): Promise<void>
    {
        await this.notificationService.fetchOlder()
            .catch(error => Log.error(error));
    }

    /**
     * Called when the `Dismiss all` icon is clicked.
     * Marks all unseen notifications as seen.
     */
    protected async onDismissAllClick(): Promise<void>
    {
        await this.notificationService.markAsSeen()
            .catch(error => Log.error(error));
    }

    /**
     * Called when a `mousedown` event occurs on a notification.
     * Marks the notification  as seen.
     */
    protected async onNotificationMouseDown(notification: Notification): Promise<void>
    {
        await this.notificationService.markAsSeen([notification])
            .catch(error => Log.error(error));
    }
}
