import { Middleware } from "koa";
import { environment } from "../../env";
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
                    context.status = context.state.internal ? 500 : error.response.status;
                    let responseCode = error.response.status;

                    // NOI errors have HTTP status codes as json body. Not possible to use instanceof since prototype has changed
                    if (error.name === "NoiApiOriginError" && error.data?.status != null)
                    {
                        // We can't use NOI invalid status codes, anything below 300
                        context.status = error.data.status > 299 ? error.data.status : 502;
                        responseCode = error.data.status;
                    }

                    context.body =
                        // tslint:disable-next-line: prefer-template
                        `Upstream request of type '${error.request.method}' for '${error.request.url}' ` +
                        `failed with status ${responseCode}.\n\n${error.message}`;

                    // When debugging is enabled, include the upstream response body in the response to the client, to ease debugging.
                    if (environment.debug)
                    {
                        const responseBody =
                            error.data != null ? JSON.stringify(error.data, undefined, 2) :
                            !error.response.bodyUsed ? await error.response.text() :
                            undefined;

                        if (responseBody)
                        {
                            context.body += `\n\nResponse body:\n${responseBody}`;
                        }
                    }
                }
                else
                {
                    context.body = `Upstream request of type '${error.request.method}' for '${error.request.url}' failed:\n\n${error.message}`;
                    context.status = 500;
                }
            }
            else
            {
                // Rethrow the error.
                throw error;
            }
        }
    };
}
