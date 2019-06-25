import { Middleware } from "koa";
import { ApiError } from "../infrastructure";

/**
 * Creates a new middlerware instance, that adds a `internal` method to the
 * context, and handles otherwise unhandled errors by sending the proper
 * response to the client.
 */
export function errorHandler(): Middleware
{
    return async (context, next) =>
    {
        // Add the `internal` method to the context.
        context.internal = () =>
        {
            context.state.internal = true;
        };

        // Catch errors and send the proper response to the client.

        try
        {
            // Run the next middleware.
            await next();
        }
        catch (error)
        {
            if (error instanceof ApiError && error.response)
            {
                context.body = `Upstream request failed: ${error.message}`;
            }
            else
            {
                context.body = `Internal server error: ${error}`;
            }

            if (!context.state.internal && error.response != null)
            {
                context.status = error.response.status;
            }
            else
            {
                context.status = 500;
            }
        }
    };
}
