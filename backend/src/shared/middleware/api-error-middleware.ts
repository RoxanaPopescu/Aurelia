import { Middleware } from "koa";
import { ApiError } from "../infrastructure";

/**
 * Creates a new middlerware instance, that adds a `internal` method to the
 * context, and handles errors by sending the proper response to the client.
 */
export function apiErrorMiddleware(): Middleware
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
            // Was the error caused by an upstream request?
            if (error instanceof ApiError)
            {
                context.body = `Upstream request failed: ${error.message}`;

                // Do we have a response for the upstream request,
                // and should we forward that status downstream?
                if (error.response && !context.state.internal)
                {
                    context.status = error.response.status;
                }
                else
                {
                    context.status = 500;
                }
            }
            else
            {
                throw error;
            }
        }
    };
}
