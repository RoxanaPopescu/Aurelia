import { Middleware } from "koa";

/**
 * Creates a new middlerware instance, that adds a `paging` property to
 * the context, based on values extracted from the request query or body.
 */
export function pagingMiddleware(): Middleware
{
    return async (context, next) =>
    {
        // Add paging, if specified.

        if (context.request.query.page != null && context.request.query.pageSize != null)
        {
            if (context.request.body.paging != null)
            {
                throw new Error("Paging cannot be specified in both query and body.");
            }

            context.paging =
            {
                page: parseInt(context.request.query.page as string),
                pageSize: parseInt(context.request.query.pageSize as string)
            };
        }
        else if (context.request.body.paging != null)
        {
            context.paging = context.request.body.paging;
        }

        // Run the next middleware.
        await next();
    };
}
