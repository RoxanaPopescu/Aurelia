import { Logger } from "aurelia-logging";
import { Log } from "../../log";

/**
 * Represents a `LogAppender` that captures log entries generated
 * by Aurelia anbd logs them using our logging infrastructure.
 */
export class LogAppender
{
    public debug(logger: Logger, message: string, ...data: any[]): void
    {
        const context = data.length > 0 ? { data } : undefined;
        Log.debug(message, { tags: { logger: logger.id }, ...context });
    }

    public info(logger: Logger, message: string, ...data: any[]): void
    {
        const context = data.length > 0 ? { data } : undefined;
        Log.info(message, { tags: { logger: logger.id }, ...context });
    }

    public warn(logger: Logger, message: string, ...data: any[]): void
    {
        const context = data.length > 0 ? { data } : undefined;
        Log.warn(message, { tags: { logger: logger.id }, ...context });
    }

    public error(logger: Logger, messageOrError: string | Error, ...data: any[]): void
    {
        if (typeof messageOrError === "string")
        {
            const error = data.find(x => x instanceof Error);
            const context = data.length > 0 ? { data: data.filter(d => d !== error) } : undefined;
            Log.error(messageOrError, error, { tags: { logger: logger.id }, ...context });
        }
        else
        {
            const context = data.length > 0 ? { data } : undefined;
            Log.error(messageOrError, { tags: { logger: logger.id }, ...context });
        }
    }
}
