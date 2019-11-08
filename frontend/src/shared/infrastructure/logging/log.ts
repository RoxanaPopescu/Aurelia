import { Container } from "aurelia-framework";
import { MapObject } from "shared/types";
import { ToastService } from "shared/framework";

// The global Sentry instance.
declare const Sentry: any;

/**
 * Represents the severity of a log entry.
 */
export type LogLevel = "debug" | "info" | "warning" | "error";

/**
 * Represents a log to which messages and errors may be logged.
 */
export abstract class Log
{
    /**
     * Sets the username that should be associated with log entries.
     * @param username The username that should be associated with log entries.
     */
    public static setUsername(username: string | undefined): void
    {
        if (Sentry != null)
        {
            Sentry.setUser({ username });
        }
    }

    /**
     * Sets the tags that should be associated with log entries.
     * @param tags The tags that should be associated with log entries.
     */
    public static setTags(tags: MapObject): void
    {
        if (Sentry != null)
        {
            Sentry.setTags(tags);
        }
    }

    /**
     * Logs the specified debug message, optionally with additional context.
     * @param message The message to log.
     * @param context The additional context to associate with the log entry.
     */
    public static debug(message: string, context?: MapObject): void
    {
        return Log.log("debug", message, undefined, context);
    }

    /**
     * Logs the specified info message, optionally with additional context.
     * @param message The message to log.
     * @param context The additional context to associate with the log entry.
     */
    public static info(message: string, context?: MapObject): void
    {
        return Log.log("info", message, undefined, context);
    }

    /**
     * Logs the specified warning message, optionally with additional context.
     * @param message The message to log.
     * @param context The additional context to associate with the log entry.
     */
    public static warn(message: string, context?: MapObject): void
    {
        return Log.log("warning", message, undefined, context);
    }

    /**
     * Logs the specified error message, optionally with additional context.
     * @param message The message to log.
     * @param context The additional context to associate with the log entry.
     */
    public static error(message: string, context?: MapObject): void;

    /**
     * Logs the specified error, optionally with additional context.
     * @param error The error to log.
     * @param context The additional context to associate with the log entry.
     */
    public static error(error: Error, context?: MapObject): void;

    /**
     * Logs the specified message and error, optionally with additional context.
     * @param message The message to log.
     * @param error The error to log.
     * @param context The additional context to associate with the log entry.
     */
    public static error(message: string, error: string | Error, context?: MapObject): void;

    public static error(...args: any[]): void
    {
        let message: string | undefined;
        let error: Error | undefined;
        let context: MapObject | undefined;

        if (args[0] instanceof Error)
        {
            error = args[0];
            context = args[1];
        }
        else
        {
            message = args[0];

            if (args[1] instanceof Error)
            {
                error = args[1];
                context = args[2];
            }
            else
            {
                context = args[1];
            }
        }

        return Log.log("error", message, error, context);
    }

    /**
     * Logs the specified message and/or error.
     * @param level The severity of the log entry.
     * @param message The message to log.
     * @param error The error to log.
     * @param context The additional context to associate with the log entry.
     */
    private static log(level: LogLevel, message?: string, error?: Error, context?: MapObject): void
    {
        const consoleMethod = level === "warning" ? "warn" : level;
        const consoleArgs = [message, error, context].filter(a => a !== undefined);

        if (level === "error")
        {
            try
            {
                if (Sentry != null)
                {
                    Sentry.withScope((scope: any) =>
                    {
                        scope.setLevel(level);

                        if (context != null)
                        {
                            for (const key of Object.keys(context))
                            {
                                scope.setExtra(key, context[key]);
                            }
                        }

                        if (error instanceof Error)
                        {
                            Sentry.captureException(error);
                        }
                        else
                        {
                            Sentry.captureMessage((message || error || "Error").toString());
                        }
                    });
                }
                else
                {
                    console[consoleMethod](...consoleArgs);
                }
            }
            finally
            {
                const toastService = Container.instance.get(ToastService);
                toastService.open("error", { message, error, context });
            }
        }
        else
        {
            console[consoleMethod](...consoleArgs);
        }
    }
}
