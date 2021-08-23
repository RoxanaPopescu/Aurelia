import { autoinject } from "aurelia-framework";
import { Toast } from "shared/framework";
import { MapObject } from "shared/types";
import settings from "resources/settings";

/**
 * Represents the model for a toast that notifies the user that an error has occurred.
 */
export interface IErrorToastModel
{
    /**
     * The message to show, or undefined if no message exists.
     */
    message?: string;

    /**
     * The error to show, or undefined if no error exists.
     */
    error?: Error | string;

    /**
     * The context associated with the error, or undefined if no error exists.
     */
    context?: MapObject;

    /**
     * The time in milliseconds before the the toast is hidden,
     * null to never hide the toast, or undefined to use the default.
     */
    timeout?: number | null;

    /**
     * A promise that will be resolved with the log entry info, if available.
     */
    entry: Promise<
    {
        /**
         * The ID of the log entry.
         */
        id: string;

        /**
         * The URL of the log entry, if available.
         */
        url?: string;
    }>;
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
     * The error message.
     */
    protected errorMessage: string;

    /**
     * The error name
     */
    protected errorName: string;

    /**
     * The error stack trace
     */
    protected errorStack: string;

    /**
     * The log entry info, if available.
     */
    protected entry: undefined |
    {
        /**
         * The ID of the log entry.
         */
        id: string;

        /**
         * The URL of the log entry, if available.
         */
        url?: string;
    };

    /**
     * The URL of the log entry, if available.
     */
    protected url: string | undefined;

    /**
     * Called by the framework when the toast is activated.
     * @param model The model to use for the toast.
     */
    public activate(model: IErrorToastModel): void
    {
        // Sets the model for the toast.
        this.model = model;

        // tslint:disable-next-line: no-floating-promises
        Promise.resolve(this.model.entry).then(entry => this.entry = entry);

        if (this.model.error instanceof Error)
        {
            // Get the name of the error.
            this.errorName = this.model.error.name.trim();

            // Get the error message, stripping out the name, if present.
            this.errorMessage = this.model.error.message.trim();

            // Get the error stack, stripping out the name and message, if present.

            let errorStack = this.model.error.stack || this.model.error.toString();

            if (errorStack.startsWith(this.errorName))
            {
                errorStack = errorStack.substring(this.errorName.length).replace(/^(\s*[:@]\s*)/, "");
            }

            if (errorStack.startsWith(this.errorMessage))
            {
                errorStack = errorStack.substring(this.errorMessage.length);
            }

            this.errorStack = errorStack.trim().split("\n").map(line => `   ${line.trim()}`).join("\n");
        }
        else if (this.model.error != null)
        {
            this.errorMessage = this.model.error.toString();
        }

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
