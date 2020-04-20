import { autoinject } from "aurelia-framework";
import { AppRouter } from "aurelia-router";
import { Toast, ToastCloseReason } from "shared/framework";
import settings from "resources/settings";

/**
 * Represents the model for a toast that notifies the user of a success.
 */
export interface IInfoToastModel
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
 * Represents a toast that notifies the user of an event or new info.
 */
@autoinject
export class InfoToast
{
    /**
     * Creates a new instance of the type.
     * @param toast The `Toast` instance representing the toast.
     * @param router The `AppRouter` instance
     */
    public constructor(toast: Toast, router: AppRouter)
    {
        this._toast = toast;
        this._router = router;
    }

    private readonly _toast: Toast;
    private readonly _router: AppRouter;
    private _closeTimeouthandle: any;

    /**
     * The model to for the toast.
     */
    protected model: IInfoToastModel;

    /**
     * Called by the framework when the toast is activated.
     * @param model The model to use for the toast.
     */
    public activate(model: IInfoToastModel): void
    {
        // Sets the model for the toast.
        this.model = model;

        // Schedule the toast to close automatically.
        if (this.model.timeout !== null)
        {
            this._closeTimeouthandle = setTimeout(() => this._toast.close(), this.model.timeout ?? settings.app.defaultToastTimeout);
        }
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
        // Prevents the toast from closing automatically.
        clearTimeout(this._closeTimeouthandle);

        return true;
    }

    /**
     * Called when a click event occurs within the toast.
     * Closes the toast, and navigates to the URL associated with the notification, if specified.
     * @param event The mouse event.
     */
    protected onClick(event: MouseEvent): void
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
            this._router.navigate(this.model.url);
        }
    }
}
