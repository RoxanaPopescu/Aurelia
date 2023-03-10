import { Container } from "aurelia-framework";
import { MapObject, AbortError } from "shared/types";

// TODO:4: This reference is technically not allowed, as `infrastructure` should not reference `framework`.
import { ToastService } from "shared/framework/services/toast";

// The global Sentry instance, defined once Sentry has been initialized.
declare const Sentry: any;

// The object representing the original console, before being wrapped by Sentry.
const unwrappedConsole = ((window as any)._console || console) as typeof console;

/**
 * Represents info about a log entry in Sentry.
 */
interface ISentryLogEntry
{
    id: string;
    url: string | undefined;
}

/**
 * Represents the user info to associate with a log entry.
 */
export interface ILogUser
{
    /**
     * The ID of the user.
     */
    readonly id?: string;

    /**
     * The username identifying the user.
     */
    readonly username?: string;

    /**
     * The email of the user.
     */
    readonly email?: string;
}

/**
 * Represents the severity of a log entry.
 */
export type LogLevel = "debug" | "info" | "warning" | "error";

/**
 * Represents a log to which messages and errors may be logged.
 */
export namespace Log
{
    /**
     * Sets the user that should be associated with log entries.
     * @param user The user that should be associated with log entries, or undefined to associate no user.
     */
    export function setUser(user: ILogUser | undefined): void
    {
        if ("Sentry" in window)
        {
            if (user != null)
            {
                // Set the identity, picking only the properties we need,
                // so sensitive information can't be accidentally leaked.
                Sentry.setUser(
                {
                    id: user.id,
                    username: user.username,
                    email: user.email
                });
            }
            else
            {
                Sentry.setUser(undefined);
            }
        }
    }

    /**
     * Sets the tags that should be associated with log entries.
     * @param tags The tags to merge into the tags that should be associated with log entries.
     */
    export function setTags(tags: MapObject): void
    {
        if ("Sentry" in window)
        {
            Sentry.setTags(tags);
        }
    }

    /**
     * Logs the specified debug message, optionally with additional context.
     * @param message The message to log.
     * @param context The context to associate with the log entry.
     */
    export function debug(message: string, context?: MapObject): void
    {
        log("debug", message, undefined, context);
    }

    /**
     * Logs the specified info message, optionally with additional context.
     * @param message The message to log.
     * @param context The context to associate with the log entry.
     */
    export function info(message: string, context?: MapObject): void
    {
        log("info", message, undefined, context);
    }

    /**
     * Logs the specified warning message, optionally with additional context.
     * @param message The message to log.
     * @param context The context to associate with the log entry.
     */
    export function warn(message: string, context?: MapObject): void
    {
        log("warning", message, undefined, context);
    }

    /**
     * Logs the specified error message, optionally with additional context.
     * @param message The message to log.
     * @param context The context to associate with the log entry.
     */
    export function error(message: string, context?: MapObject): void;

    /**
     * Logs the specified error, optionally with additional context.
     * Note that errors of type `AbortError` will be ignored.
     * @param error The error to log.
     * @param context The context to associate with the log entry.
     */
    export function error(errors: Error, context?: MapObject): void;

    /**
     * Logs the specified error message and error, optionally with additional context.
     * Note that errors of type `AbortError` will be ignored.
     * @param message The message to log.
     * @param error The error to associate with the log entry.
     * @param context The context to associate with the log entry.
     */
    export function error(message: string, error: Error | string, context?: MapObject): void;

    export function error(...args: any[]): void
    {
        let message: string | undefined;
        let context: MapObject | undefined;

        // tslint:disable-next-line: no-shadowed-variable
        let error: Error | string | undefined;

        if (args[0] instanceof Error)
        {
            error = args[0];
            context = args[1];
        }
        else
        {
            message = args[0];

            if (args[1] instanceof Error || typeof args[0] === "string")
            {
                error = args[1];
                context = args[2];
            }
            else
            {
                context = args[1];
            }
        }

        if (error instanceof AbortError)
        {
            return;
        }

        log("error", message, error, context);
    }
}

/**
 * Logs the specified message and/or errors.
 * @param level The severity of the log entry.
 * @param message The message to log.
 * @param errors The errors to associate with the log entry.
 * @param context The context to associate with the log entry.
 */
function log(level: LogLevel, message?: string, error?: Error | string, context?: MapObject): void
{
    logToConsole(level, message, error, context);

    let entry: Promise<ISentryLogEntry | undefined> | undefined;

    try
    {
        if (level === "error" && "Sentry" in window)
        {
            entry = logToSentry(level, message, error, context);
        }
    }
    finally
    {
        if (level === "error")
        {
            showAsToast(level, message, error, context, entry);
        }
    }
}

/**
 * Logs the specified message and/or errors to the console.
 * @param level The severity of the log entry.
 * @param message The message to log.
 * @param errors The errors to associate with the log entry.
 * @param context The context associated with the log entry.
 */
function logToConsole(level: LogLevel, message?: string, error?: Error | string, context?: MapObject): void
{
    const consoleMethod = level === "warning" ? "warn" : level;
    const consoleArgs = [message, error, context].filter(a => a !== undefined);

    unwrappedConsole[consoleMethod](...consoleArgs);
}

/**
 * Logs the specified message and/or errors to Sentry.
 * @param level The severity of the log entry.
 * @param message The message to log.
 * @param errors The errors to associate with the log entry.
 * @param context The context associated with the log entry.
 * @returns A promise that will be resolved with the ID of the log entry, or undefined if not logged.
 */
async function logToSentry(level: LogLevel, message?: string, error?: Error | string, context?: MapObject): Promise<ISentryLogEntry | undefined>
{
    return new Promise((resolve, reject) =>
    {
        const { tags, ...data } = context || {};

        Sentry.withScope((scope: any) =>
        {
            // Set the level of the log entry.
            scope.setLevel(level);

            // Attach the tags to the log entry.
            if (tags != null)
            {
                scope.setTags(tags);
            }

            // Sentry has no way to log a message and an error
            // together, so attach any error as data instead.
            if (message && error != null)
            {
                    scope.setExtra("error", error);
            }

            // Attach the data to the log entry.
            if (data != null)
            {
                for (const key of Object.keys(data))
                {
                    scope.setExtra(key, data[key]);
                }
            }

            let id: string | undefined;

            // Capture the log entry.
            if (message)
            {
                id = Sentry.captureMessage(message);
            }
            else if (error != null)
            {
                id = Sentry.captureException(error);
            }
            else
            {
                id = Sentry.captureMessage("An unknown error occurred");
            }

            if (id)
            {
                const url = ENVIRONMENT.integrations.sentry?.eventUrlPattern?.replace("{id}", id);
                resolve({ id, url });
            }

            resolve(undefined);
        });
    });
}

/**
 * Shows the specified message and/or errors as a toast notification.
 * @param level The severity of the log entry.
 * @param message The message that was logged.
 * @param errors The errors associated with the log entry.
 * @param context The context associated with the log entry.
 * @param entry A promise that will be resolved with the log entry info, if available.
 */
function showAsToast(level: LogLevel, message?: string, error?: Error | string, context?: MapObject, entry?: Promise<ISentryLogEntry | undefined>): void
{
    const toastService = Container.instance.get(ToastService);

    // HACK: Prevent what appears to be technical error messages from being used as headings in toasts.
    if (error == null && /^\w*Error:/i.test(message!))
    {
        // tslint:disable: no-parameter-reassignment
        error = message as any;
        message = undefined;
        // tslint:enable
    }

    toastService.open(level, { message, error, context, entry });
}
