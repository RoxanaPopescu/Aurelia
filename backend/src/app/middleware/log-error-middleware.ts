import { Middleware } from "koa";
import { environment } from "../../env";

/**
 * Creates a new middlerware instance, that if debug mode is enabled,
 * logs any errors that occur during request handling to the console.
 */
export function logErrorMiddleware(): Middleware
{
    return async (context, next) =>
    {
        try
        {
            // Run the next middleware.
            await next();
        }
        catch (error)
        {
            // When debugging is enabled, log the error to the console.
            if (environment.debug)
            {
                console.error(error);
            }

            // Rethrow the error.
            throw error;
        }
    };
}
