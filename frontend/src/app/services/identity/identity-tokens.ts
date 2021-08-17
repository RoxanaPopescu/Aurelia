import njwt from "njwt";
import { DateTime } from "luxon";

/**
 * Represents the data for the tokens associated with an identity.
 */
export interface IIdentityTokens
{
    /**
     * The refresh token, used for authentication.
     */
    refreshToken: string;

    /**
     * The access token, used for authorization.
     */
    accessToken: string;

    /**
     * True if the tokens should be stored on the device, otherwise false.
     */
    remember: boolean;
}

/**
 * Represents the tokens associated with an identity.
 */
export class IdentityTokens
{
    /**
     * Creates a new instance of the type.
     * @param data The data representing the tokens.
     */
    public constructor(data: IIdentityTokens)
    {
        this.refreshToken = data.refreshToken;
        this.accessToken = data.accessToken;
        this.remember = data.remember;

        const accessJwt = this.parseJwt(this.accessToken);

        if (accessJwt.exp != null)
        {
            this.accessTokenExpires = DateTime.fromMillis(accessJwt.exp * 1000);
        }

        // Convert claims to a permission set.

        const permissions = accessJwt.organization_permissions instanceof Array
            ? accessJwt.organization_permissions as string[]
            : [accessJwt.organization_permissions as string];

        this.claims = new Set<string>(permissions);
    }

    /**
     * The refresh token, used for authentication.
     */
    public readonly refreshToken: string;

    /**
     * The access token, used for authorization.
     */
    public readonly accessToken: string;

    /**
     * The date and time at which the access token expires, or undefined if the token never expires.
     */
    public readonly accessTokenExpires: DateTime | undefined;

    /**
     * The claims assigned to the user.
     */
    public readonly claims: ReadonlySet<string>;

    /**
     * True if the tokens should be stored on the device, otherwise false.
     */
    public readonly remember: boolean;

    /**
     * Parses the specified access token.
     * @param accessToken The access token to parse.
     * @returns The object representing the specified access token.
     */
    private parseJwt(accessToken: string): any
    {
        try
        {
            const jwt = njwt.verify(accessToken, "irrelevant, as we don't care about verification here", "HS256");

            return jwt.parsedBody;
        }
        catch (error)
        {
            if (error.parsedBody == null)
            {
                throw new Error(`Could not parse the JWT token. ${error.message}`);
            }

            return error.parsedBody;
        }
    }
}
