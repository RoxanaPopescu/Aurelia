import njwt from "njwt";
import gravatarUrl from "gravatar-url";
import { Outfit } from "app/model/outfit";
import { ApiResult } from "shared/infrastructure";
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
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
        this.remember = data.remember;

        const jwt = this.parseJwt(this.accessToken);

        this.expires = jwt.exp ? DateTime.fromMillis(jwt.exp * 1000) : undefined;

        this.claims = new Set<string>(Object.keys(jwt)
            .filter(claim => jwt[claim] === "true")
            .map(claim => claim.toLowerCase().replace(/\s/g, "-")));
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
     * The date and time before which the tokens must be refreshed,
     * in order to ensure continuous access.
     */
    public readonly expires?: DateTime;

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
            const jwt = njwt.verify(accessToken);

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

/**
 * Represents the identity of an authenticated user.
 */
export class Identity
{
    /**
     * Creates a new instance of the type.
     * @param result The `ApiResult` from which the instance should be created.
     * @param tokens The tokens to use, if not specified in the response.
     */
    public constructor(result: ApiResult, tokens: IIdentityTokens)
    {
        this.id = result.data.userInfo.userId;
        this.username = result.data.userInfo.username;
        this.fullName = `${result.data.userInfo.firstName} ${result.data.userInfo.lastName}`;
        this.preferredName = result.data.userInfo.firstName;
        this.pictureUrl = result.data.userInfo.pictureUrl;

        this.outfit = new Outfit(result.data.outfit);

        if (this.pictureUrl == null || this.pictureUrl.endsWith("avatar.png"))
        {
            this.pictureUrl = gravatarUrl(result.data.userInfo.username, { default: this.pictureUrl ?? "404" });
        }

        const accessToken = result.response.headers.get("access-token") || tokens.accessToken;
        const refreshToken = result.response.headers.get("refresh-token") || tokens.refreshToken;

        if (!accessToken || !refreshToken)
        {
            throw new Error("No auth tokens specified.");
        }

        this.tokens = new IdentityTokens(
        {
            accessToken: accessToken,
            refreshToken: refreshToken,
            remember: tokens.remember
        });

        this.claims = this.tokens.claims;
    }

    /**
     * The ID of the user.
     */
    public readonly id: string;

    /**
     * The username identifying the user.
     */
    public readonly username: string;

    /**
     * The full name of the user.
     */
    public readonly fullName: string;

    /**
     * The preferred name of the user.
     */
    public readonly preferredName: string;

    /**
     * The URL for the user picture.
     */
    public readonly pictureUrl: string;

    /**
     * The outfit to which the user belongs.
     */
    public readonly outfit: Outfit;

    /**
     * The claims assigned to the user.
     */
    public readonly claims: ReadonlySet<string>;

    /**
     * The the tokens to use when accessing the API.
     */
    public readonly tokens: IdentityTokens;
}
