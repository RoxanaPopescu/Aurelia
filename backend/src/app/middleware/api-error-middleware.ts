import { Middleware, BaseContext } from "koa";
import { Request, Response } from "node-fetch";
import { ApiError, NoiApiOriginError } from "../../shared/infrastructure";
import { environment } from "../../env";

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
                context.body = "Upstream request failed";

                if (environment.debug)
                {
                    // BUG: Disabled because it relies on stream cloning, which is disabled due to https://github.com/node-fetch/node-fetch/issues/151.
                    // await appendDebugInfo(context, error);
                }

                // Do we have a response, and should we forward its status code downstream?
                if (error.response != null && !context.state.internal)
                {
                    context.status = error.response.status;

                    // TODO: This should be removed, as those may not be HTTP status codes.
                    // Errors from NOI have status codes in the response body.
                    if (error instanceof NoiApiOriginError && error.data?.status != null)
                    {
                        context.status = error.data.status > 299 ? error.data.status : 502;
                    }
                }
                else
                {
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

/**
 * Appends debug info to the response body sent to the client.
 * @param context The context for the request currently being handled.
 * @param error The error currently being handled.
 * @returns A promise that will be resolved when the operation completes.
 */
async function appendDebugInfo(context: BaseContext, error: ApiError): Promise<void>
{
    // Include the error message in the response to the client.

    context.body += `\n\n${error.message}`;

    // Include the upstream request body in the response to the client.

    const requestBody = await getFormattedBody(error.request);

    if (requestBody)
    {
        context.body += `\n\nRequest body:\n${requestBody}`;
    }

    // Include the upstream response body in the response to the client, if available.

    if (error.response != null)
    {
        const responseBody = await getFormattedBody(error.response);

        if (responseBody)
        {
            context.body += `\n\nResponse body:\n${responseBody}`;
        }
    }
}

/**
 * Gets the formatted body of the specified request or response.
 * @param requestOrResponse The request or response whose body should be formatted.
 * @returns A promise that will be resolved with the formatted body of the specified request or response.
 */
async function getFormattedBody(requestOrResponse: Request | Response): Promise<string | undefined>
{
    let body: string | undefined;

    if (!requestOrResponse.bodyUsed)
    {
        // Read the body as text.
        body = await requestOrResponse.clone().text();
    }

    if (body)
    {
        // Determine whether the body should be parsed as JSON.
        const contentType = requestOrResponse.headers.get("content-type");
        const hasJsonBody = contentType != null && /^application\/(.+\+)?json(;|$)/.test(contentType);

        if (hasJsonBody)
        {
            // Format the body as JSON.
            body = JSON.stringify(JSON.parse(body), undefined, 2);
        }
    }

    return body;
}
