import { Middleware } from "koa";

/**
 * Creates a new middlerware instance, that adds a `paging` and/or `sorting` property
 * to the context, based on values extracted from the request query or body.
 */
export function pagingAndSorting(): Middleware
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
                page: parseInt(context.request.query.page),
                pageSize: parseInt(context.request.query.pageSize)
            };
        }
        else if (context.request.body.paging != null)
        {
            context.paging = context.request.body.paging;
        }

        // Add sorting, if specified.

        if (context.request.query.sortProperty != null && context.request.query.sortDirection != null)
        {
            if (context.request.body.sorting != null)
            {
                throw new Error("Sorting cannot be specified in both query and body.");
            }

            context.sorting =
            {
                sortProperty: context.request.query.sortProperty,
                sortDirection: context.request.query.sortDirection
            };
        }
        else if (context.request.body.sorting != null)
        {
            context.sorting = context.request.body.sorting;
        }

        // Run the next middleware.
        await next();
    };
}
