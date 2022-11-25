import { autoinject } from "aurelia-framework";
import { HistoryHelper } from "shared/infrastructure";
import { Toast, ToastCloseReason } from "shared/framework";
import { Notification } from "../../services/notification";
import settings from "resources/settings";

/**
 * Represents a toast that notifies the user of a new notification.
 */
@autoinject
export class NotificationToast
{
    /**
     * Creates a new instance of the type.
     * @param toast The `Toast` instance representing the toast.
     * @param historyHelper The `HistoryHelper` instance.
     */
    public constructor(toast: Toast, historyHelper: HistoryHelper)
    {
        this._toast = toast;
        this._historyHelper = historyHelper;
    }

    private readonly _toast: Toast;
    private readonly _historyHelper: HistoryHelper;

    /**
     * The model to for the toast.
     */
    protected model: Notification;

    /**
     * The time in milliseconds before the toast will automatically close,
     * or undefined to not close automatically.
     * Note that this must be set at the time the toast is attached, and that
     * only undefined may be assigned thereafter, to cancel the timeout.
     * Note that if closed automatically, the close reason is `close-timeout`.
     */
    protected closeTimeout = settings.app.notifications.toastTimeout;

    /**
     * Called by the framework when the toast is activated.
     * @param model The model to use for the toast.
     */
    public activate(model: Notification): void
    {
        // Sets the model for the toast.
        this.model = model;
    }

    /**
     * Called by the framework when the toast is deactivated.
     * @param reason The reason for closing the modal.
     * @returns True if the user interacted with the notification, otherwise false.
     */
    public deactivate(reason?: ToastCloseReason): boolean
    {
        this.cancelScheduledClose();

        if (reason === undefined)
        {
            return true;
        }

        return false;
    }

    /**
     * Called when a mousedown event occurs within the toast.
     */
    protected cancelScheduledClose(): boolean
    {
        return true;
    }

    /**
     * Called when a click event occurs within the toast.
     * Closes the toast, and navigates to the URL associated with the notification, if specified.
     * @param event The mouse event.
     */
    protected async onClick(event: MouseEvent): Promise<void>
    {
        if (event.defaultPrevented)
        {
            return;
        }

        // Closes the toast immediately.
        // tslint:disable-next-line: no-floating-promises
        this._toast.close();

        // Navigate to the URL associated with the notification, if specified.
        if (this.model.url)
        {
            await this._historyHelper.navigate(this.model.url);
        }
    }
}
