import jwt from "jsonwebtoken";
import jwksRsa from "jwks-rsa";
import { Middleware } from "koa";
import { AuthorizationError } from "../../shared/types";
import { AuthorizeParameter, IAppContext } from "../../app/app-context";
import { setRequestHeaders } from "./headers-middleware";
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
        this.organizationId = jwtObject["organization_id"];
        this.email = jwtObject["email"];
        this.fullName = jwtObject["name"];
        this.preferredName = jwtObject["preferred_username"];
        this.roleId = jwtObject["role_id"];
        this.teamIds = jwtObject["team_ids"];

        // Convert claims to a permission set.
        const permissions = typeof jwtObject.organization_permissions === "string"
            ? [jwtObject.organization_permissions as string]
            : jwtObject.organization_permissions as string[] ?? [];

        this.permissions = new Set<string>(permissions);
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
    public roleId?: string;

    /**
     * The ID of the organization to which the user belongs.
     */
    public organizationId: string;

    /**
     * The IDs of the teams to which the user belongs.
     */
    public teamIds: string;

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

    let jwksRsaClient = jwksRsa({ jwksUri: settings.app.oAuth.jwksUri });

    const getKeyFunc = (header: any, callback: any) =>
    {
        // Try to get the signing key.
        jwksRsaClient.getSigningKey(header.kid, (error1: any, key1: any) =>
        {
            if (error1)
            {
                // Try recreating the client, as potential workaround for
                // https://github.com/auth0/node-jwks-rsa/issues/257

                jwksRsaClient = jwksRsa({ jwksUri: settings.app.oAuth.jwksUri });

                // Try fetching the signing key again.
                jwksRsaClient.getSigningKey(header.kid, (error2: any, key2: any) =>
                {
                    if (error2)
                    {
                        // Recreate the client again, before giving up.
                        jwksRsaClient = jwksRsa({ jwksUri: settings.app.oAuth.jwksUri });
                    }

                    callback(error2, key2?.publicKey || key2?.rsaPublicKey);
                });
            }
            else
            {
                callback(error1, key1?.publicKey || key1?.rsaPublicKey);
            }
        });
    };

    return async (context, next) =>
    {
        // Add the `authorize` method to the context.
        context.authorize = async (...permissions: AuthorizeParameter[]) =>
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
            for (const permission of permissions)
            {
                switch (typeof permission)
                {
                    case "string":

                        if (!context.user.permissions.has(permission))
                        {
                            throw new AuthorizationError("The request contained a JWT with insufficient permissions.");
                        }

                        break;

                    case "boolean":

                        // tslint:disable-next-line: no-boolean-literal-compare
                        if (permission !== true)
                        {
                            throw new AuthorizationError("The request was not authorized.");
                        }

                        break;

                    case "function":

                        // tslint:disable-next-line: no-boolean-literal-compare
                        if (await permission() !== true)
                        {
                            throw new AuthorizationError("The request was not authorized.");
                        }

                        break;

                    case "object":

                        // tslint:disable-next-line: no-boolean-literal-compare
                        if (permission.organization != null)
                        {
                            if (context.user.organizationId !== permission.organization)
                            {
                                throw new AuthorizationError("The request was not authorized for the specified organization.");
                            }
                        }

                        // tslint:disable-next-line: no-boolean-literal-compare
                        if (permission.teams != null)
                        {
                            // HACK: For convenience, if specified as a query string value, split on `,`.
                            const teamIds = (typeof permission.teams === "string" ? permission.teams.trim().split(/\s*,\s*/) : permission.teams)

                                // HACK: For convenience, if specified as a query string value, filter out the "no-team" value.
                                .filter(teamId => teamId !== "no-team");

                            if (!context.user.permissions.has("access-all-teams") && !teamIds.every(teamId => context.user!.teamIds.includes(teamId)))
                            {
                                throw new AuthorizationError("The request was not authorized for the specified teams.");
                            }
                        }

                        break;

                    default:

                        throw new Error("Invalid permission.");
                }
            }

            // Set request headers, so they can be included with all requests.
            setRequestHeaders(
            {
                userId: context.user.id,
                organizationId: context.user.organizationId
            })
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
