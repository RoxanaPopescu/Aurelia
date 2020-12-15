import jwt from "jsonwebtoken";
import { Middleware } from "koa";
import { AuthorizationError } from "../../shared/types";
import { IAppContext } from "../../app/app-context";

/**
 * Represents the options to use for the authorize middleware.
 */
export interface IAuthorizeMiddlewareOptions
{
    issuer: string;
    header: string;
    cookie: string;
    secret: string;
}

/**
 * Represents the authenticated user.
 */
export class User
{
    /**
     * Creates a new instance of the class.
     * @param jwtObject The JWT object from which the user should be created.
     */
    public constructor(jwtObject: any)
    {
        // HACK: This is more complex than it should be, as it needs to support the legacy JWT format.

        // tslint:disable: no-string-literal

        this.id = jwtObject["nameid"];

        this.username = jwtObject["unique_name"];

        // Add hypens to the GUID.
        this.outfitId = jwtObject["primary-outfit"]
            .replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");

        // Convert boolean claims to a permission set.
        this.permissions = new Set<string>(Object.keys(jwtObject)
            .filter(key => jwtObject[key] === "true")
            .map(key => key.toLowerCase().split(/\s+/).join("-")));

        // tslint:enable
    }

    /**
     * The ID of the user.
     */
    public id: string;

    /**
     * The username of the user.
     */
    public username: string;

    /**
     * The ID of the outfit to which the user belongs.
     */
    public outfitId: string;

    /**
     * The permissions assigned to the user.
     */
    public permissions: ReadonlySet<string>;
}

/**
 * Creates a new middlerware instance, that adds an `authorize` method
 * to the context, which if called verifies that the user is authenticated,
 * and that the user has all the specified permissions. If authorization fails,
 * an error will be thrown, which eventually results in an 401 response.
 */
export function authorizeMiddleware(options: IAuthorizeMiddlewareOptions): Middleware<any, IAppContext>
{
    return async (context, next) =>
    {
        // Add the `authorize` method to the context.
        context.authorize = (...permissions: string[]) =>
        {
            // Try to parse and verify the JWT, if not done already.
            if (context.user === undefined)
            {
                const jwtString =
                    context.headers[options.header]?.replace(/^Bearer\s+/, "") ||
                    context.cookies.get(options.cookie);

                if (jwtString)
                {
                    try
                    {
                        const verifyOptions: jwt.VerifyOptions =
                        {
                            issuer: options.issuer
                        };

                        const jwtObject = jwt.verify(jwtString, options.secret, verifyOptions);

                        context.user = new User(jwtObject);
                    }
                    catch (error)
                    {
                        context.user = null;

                        throw new AuthorizationError("The request contained an invalid JWT.");
                    }
                }
                else
                {
                    context.user = null;
                }
            }

            // Verify that the JWT contains the user.
            if (context.user == null)
            {
                throw new AuthorizationError("The request did not contain a valid JWT.");
            }

            // Verify that the JWT contains the specified permissions.
            if (permissions.length > 0)
            {
                if (!permissions.some(permission => context.user!.permissions.has(permission)))
                {
                    throw new AuthorizationError("The request contained a JWT with insufficient permissions.");
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
