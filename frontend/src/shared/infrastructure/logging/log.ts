import { MapObject } from "shared/types";

/**
 * Represents the type of a log entry.
 */
export type LogType = "debug" | "info" | "warn" | "error";

/**
 * Represents a log to which messages and errors may be logged.
 */
export abstract class Log
{
    /**
     * Logs the specified debug message, optionally with additional context.
     * @param message The message to log.
     * @param context The additional context to associate with the log entry.
     * @returns A promise that will be resolved when the entry has been successfully logged to all log providers.
     */
    public static async debug(message: string, context?: MapObject): Promise<void>
    {
        return Log.log("debug", message, undefined, context);
    }

    /**
     * Logs the specified info message, optionally with additional context.
     * @param message The message to log.
     * @param context The additional context to associate with the log entry.
     * @returns A promise that will be resolved when the entry has been successfully logged to all log providers.
     */
    public static async info(message: string, context?: MapObject): Promise<void>
    {
        return Log.log("info", message, undefined, context);
    }

    /**
     * Logs the specified warning message, optionally with additional context.
     * @param message The message to log.
     * @param context The additional context to associate with the log entry.
     * @returns A promise that will be resolved when the entry has been successfully logged to all log providers.
     */
    public static async warn(message: string, context?: MapObject): Promise<void>
    {
        return Log.log("warn", message, undefined, context);
    }

    /**
     * Logs the specified error message, optionally with additional context.
     * @param message The message to log.
     * @param context The additional context to associate with the log entry.
     * @returns A promise that will be resolved when the entry has been successfully logged to all log providers.
     */
    public static async error(message: string, context?: MapObject): Promise<void>;

    /**
     * Logs the specified error, optionally with additional context.
     * @param error The error to log.
     * @param context The additional context to associate with the log entry.
     * @returns A promise that will be resolved when the entry has been successfully logged to all log providers.
     */
    public static async error(error: Error, context?: MapObject): Promise<void>;

    /**
     * Logs the specified message and error, optionally with additional context.
     * @param message The message to log.
     * @param error The error to log.
     * @param context The additional context to associate with the log entry.
     * @returns A promise that will be resolved when the entry has been successfully logged to all log providers.
     */
    public static async error(message: string, error: string | Error, context?: MapObject): Promise<void>;

    public static async error(...args: any[]): Promise<void>
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
     * Safely invokes the specified method with the specified arguments on each of the providers, catching and logging any exceptions that occur to the console.
     * @param method The method that should be invoked on each provider.
     * @param message The message to log.
     * @param error The error to log.
     * @param context The additional context to associate with the log entry.
     * @returns A promise that will be resolved when the entry has been successfully logged to all log providers.
     */
    private static async log(method: LogType, message?: string, error?: Error, context?: MapObject): Promise<void>
    {
        console[method](...[message, error, context].filter(a => a !== undefined));

        if (method === "error")
        {
            alert(message || "An error occurred.\nSee the console for details.");
        }
    }
}
