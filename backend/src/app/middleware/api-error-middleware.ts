import { Middleware } from "koa";
import { ApiError } from "../../shared/infrastructure";

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
                // Do we have a response for the upstream request,
                // and should we forward that status downstream?
                if (error.response)
                {
                    context.body = `Upstream request for ${error.request.url} failed with status ${error.response.status}:\n${error.message}`;
                    context.status = context.state.internal ? 500 : error.response.status;
                }
                else
                {
                    context.body = `Upstream request for ${error.request.url} failed:\n${error.message}`;
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
