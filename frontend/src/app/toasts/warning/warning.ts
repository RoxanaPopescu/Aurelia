import { autoinject } from "aurelia-framework";
import { HistoryHelper } from "shared/infrastructure";
import { Toast, ToastCloseReason } from "shared/framework";
import settings from "resources/settings";

/**
 * Represents the model for a toast that notifies the user of a warning.
 */
export interface IWarningToastModel
{
    /**
     * The heading text to show.
     */
    heading: string;

    /**
     * The body text to show, or undefined to show no body text.
     */
    body: string;

    /**
     * The details to show, or undefined to show no details section.
     */
    details: string;

    /**
     * The time in milliseconds before the the toast is hidden,
     * null to never hide the toast, or undefined to use the default.
     */
    timeout?: number | null;

    /**
     * The URL associated with the toast, if any.
     */
    url?: string;
}

/**
 * Represents a toast that notifies the user of a warning.
 */
@autoinject
export class WarningToast
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
    protected model: IWarningToastModel;

    /**
     * The time in milliseconds before the toast will automatically close,
     * or undefined to not close automatically.
     * Note that this must be set at the time the toast is attached, and that
     * only undefined may be assigned thereafter, to cancel the timeout.
     * Note that if closed automatically, the close reason is `close-timeout`.
     */
    protected closeTimeout: number | undefined;

    /**
     * Called by the framework when the toast is activated.
     * @param model The model to use for the toast.
     */
    public activate(model: IWarningToastModel): void
    {
        // Sets the model for the toast.
        this.model = model;

        // Set the close timeout.
        this.closeTimeout = this.model.timeout ?? this.model.timeout !== null ? settings.app.defaultToastTimeout : undefined;
    }

    /**
     * Called by the framework when the toast is deactivated.
     * @param reason The reason for closing the modal.
     * @returns True if the user clicked the notification, otherwise false.
     */
    public deactivate(reason?: ToastCloseReason): boolean
    {
        if (reason === "click")
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
        // Prevent the toast from closing automatically.
        this.closeTimeout = undefined;

        return true;
    }

    /**
     * Called when a mousedown event occurs within the toast.
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
        this._toast.close("click");

        // Navigate to the URL associated with the notification, if specified.
        if (this.model.url)
        {
            await this._historyHelper.navigate(this.model.url);
        }
    }
}
