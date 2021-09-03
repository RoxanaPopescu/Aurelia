import jwt from "jsonwebtoken";
import jwksRsa from "jwks-rsa";
import { Middleware } from "koa";
import { AuthorizationError } from "../../shared/types";
import { IAppContext } from "../../app/app-context";
import settings from "../../resources/settings/settings";

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
        this.id = jwtObject["sub"];
        this.outfitId = jwtObject["organization"];

        // TODO: This does not exist in the JWT.
        this.email = jwtObject["email"];
        this.fullName = jwtObject["name"];
        this.preferredName = jwtObject["preferred_username"];
        this.roleName = jwtObject["role"];

        // Convert claims to a permission set.

        const permissions = typeof jwtObject.organization_permissions === "string"
            ? [jwtObject.organization_permissions as string]
            : jwtObject.organization_permissions as string[] ?? [];

        // HACK: Transform permission names to slugs.
        this.permissions = new Set<string>(permissions.map(p => p.toLowerCase().replace(/\s/g, "-")));
    }

    /**
     * The ID of the user.
     */
    public id: string;

    /**
     * The email of the user.
     */
    public email: string;

    /**
     * The full name of the user.
     */
    public fullName: string;

    /**
     * The preferred name of the user.
     */
    public preferredName: string;

    /**
     * The role of the user.
     */
    public roleName: string;

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
    const verifyOptions: jwt.VerifyOptions =
    {
        issuer: options.issuer
    };

    const jwksRsaClient = jwksRsa(
    {
        jwksUri: settings.app.oAuth.jwksUri
    });

    const getKeyFunc = (header: any, callback: any) =>
    {
        jwksRsaClient.getSigningKey(header.kid, (error: any, key: any) =>
            callback(error, key?.publicKey || key?.rsaPublicKey));
    };

    return async (context, next) =>
    {
        // Add the `authorize` method to the context.
        context.authorize = async (...permissions: string[]) =>
        {
            // Try to parse and verify the JWT, if not done already.
            if (context.user === undefined)
            {
                const jwtString =
                    (context.headers[options.header] as string)?.replace(/^Bearer\s+/, "") ||
                    context.cookies.get(options.cookie);

                if (jwtString)
                {
                    try
                    {
                        const jwtObject = await new Promise<any>((resolve, reject) =>
                        {
                            jwt.verify(jwtString, getKeyFunc, verifyOptions, (error, decoded) =>
                                error ? reject(error) : resolve(decoded));
                        });

                        context.user = new User(jwtObject);
                    }
                    catch (error)
                    {
                        context.user = null;

                        throw new AuthorizationError("The request contained an invalid JWT, or validation failed.");
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
