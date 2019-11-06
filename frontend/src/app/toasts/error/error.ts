import { autoinject } from "aurelia-framework";
import { Toast } from "shared/framework/services/toast";
import { MapObject } from "shared/types";

export interface IErrorToastModel
{
    /**
     * The message to show, or undefined if no message exists.
     */
    message?: string;

    /**
     * The error to show, or undefined if no error exists.
     */
    error?: Error;

    /**
     * The context associated with the error, or undefined if no error exists.
     */
    context?: MapObject;
}

/**
 * Represents a toast that notifies the user that an error has occurred.
 */
@autoinject
export class ErrorToast
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
    protected model: IErrorToastModel;

    /**
     * Called by the framework when the toast is activated.
     * @param model The model to use for the toast.
     */
    public activate(model: IErrorToastModel): void
    {
        // Sets the model for the toast.
        this.model = model;

        // Schedule the toast to close automatically.
        this._closeTimeouthandle = setTimeout(() => this._toast.close(), 20000);
    }

    /**
     * Called when a mousedown event occurs within the toast.
     */
    protected cancelScheduledClose(): void
    {
        // Prevents the toast from closing automatically.
        clearTimeout(this._closeTimeouthandle);
    }
}
