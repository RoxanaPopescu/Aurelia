import { Middleware } from "koa";
import { AuthorizationError } from "../../shared/types";

/**
 * Creates a new middlerware instance, that adds an `authorize` method
 * to the context, which if called verifies that the user is authenticated,
 * and that the user has all the specified claims. If authorization fails,
 * an error will be thrown, which eventually results in an 401 response.
 */
export function koaAuthorize(): Middleware
{
    return async (context, next) =>
    {
        // Add the `authorize` method to the context.
        context.authorize = (...claims: string[]) =>
        {
            // Ensure the user is authenticated and has claims.
            if (context.user == null || context.user.claims == null)
            {
                throw new AuthorizationError();
            }

            // Ensure the user has the specified claims.
            if (claims.some(claim => !context.user.claims.includes(claim)))
            {
                throw new AuthorizationError();
            }
        };

        try
        {
            // Run the next middleware.
            await next();
        }
        catch (error)
        {
            // Handle authorization errors by returning a 401 response.
            if (error instanceof AuthorizationError)
            {
                context.body = undefined;
                context.status = 401;
            }
            else
            {
                throw error;
            }
        }
    };
}
