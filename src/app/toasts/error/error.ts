import { autoinject } from "aurelia-framework";
import { MapObject } from "shared/types";
import settings from "resources/settings";
import { ApiOriginError, IApiProblem } from "shared/infrastructure";

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
    entry?: Promise<
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
     * The problem associated with the error, if any.
     */
    protected errorProblem: IApiProblem;

    /**
     * The log entry info, once successfully logged, null if logging failed,
     * or undefined if logging is pending or was not attempted.
     */
    protected entry: undefined | null |
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
    public activate(model: IErrorToastModel): void
    {
        // Sets the model for the toast.
        this.model = model;

        // tslint:disable-next-line: no-floating-promises
        this.model.entry?.then(entry => this.entry = entry).catch(error => this.entry = null);

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

        if (this.model.error instanceof ApiOriginError)
        {
            this.errorProblem = this.model.error.data;
        }

        // Set the close timeout.
        this.closeTimeout = this.model.timeout ?? this.model.timeout !== null ? settings.app.defaultToastTimeout : undefined;
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
}
