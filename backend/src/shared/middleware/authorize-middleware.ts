import jwt from "jsonwebtoken";
import { Middleware } from "koa";
import { AuthorizationError } from "../../shared/types";

/**
 * Represents the options to use for the authorize middleware.
 */
export interface IAuthorizeMiddlewareOptions
{
    issuer: string;
    audience: string;
    header: string;
    cookie: string;
    secret: string;
}

/**
 * Creates a new middlerware instance, that adds an `authorize` method
 * to the context, which if called verifies that the user is authenticated,
 * and that the user has all the specified permissions. If authorization fails,
 * an error will be thrown, which eventually results in an 401 response.
 */
export function authorizeMiddleware(options: IAuthorizeMiddlewareOptions): Middleware
{
    return async (context, next) =>
    {
        // Add the `authorize` method to the context.
        context.authorize = (...permissions: string[]) =>
        {
            // Parse and verify the JWT, if not done already.
            if (context.state.jwt === undefined)
            {
                // Try to get the JWT from the request.
                const jwtString =
                    context.headers[options.header] ||
                    context.cookies.get(options.cookie);

                if (jwtString)
                {
                    try
                    {
                        const verifyOptions: jwt.VerifyOptions =
                        {
                            issuer: options.issuer,
                            audience: options.audience
                        };

                        // Try to parse and verify the JWT.
                        context.state.jwt = jwt.verify(jwtString, options.secret, verifyOptions);
                    }
                    catch (error)
                    {
                        // Indicate that the JWT is invalid.
                        context.state.jwt = null;
                    }
                }
            }

            // Verify that a valid JWT was provided.
            if (context.state.jwt == null)
            {
                throw new AuthorizationError("The request did not contain a valid JWT.");
            }

            // Verify that the JWT contains the specified permissions.
            if (permissions.length > 0)
            {
                if (context.state.jwt.permissions == null)
                {
                    throw new AuthorizationError("The JWT did not contain any permissions.");
                }

                if (permissions.some(claim => !context.user.permissions.includes(claim)))
                {
                    throw new AuthorizationError("The JWT did not contain the specified permissions.");
                }
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
                context.body = `Unauthorized: ${error.message}`;
                context.status = 401;
            }
            else
            {
                throw error;
            }
        }
    };
}
