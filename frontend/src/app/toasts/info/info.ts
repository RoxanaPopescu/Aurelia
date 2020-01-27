import { autoinject } from "aurelia-framework";
import { Toast } from "shared/framework";
import settings from "resources/settings";

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
     */
    public constructor(toast: Toast)
    {
        this._toast = toast;
    }

    private readonly _toast: Toast;
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
     * Called when a mousedown event occurs within the toast.
     */
    protected cancelScheduledClose(): boolean
    {
        // Prevents the toast from closing automatically.
        clearTimeout(this._closeTimeouthandle);

        return true;
    }
}
