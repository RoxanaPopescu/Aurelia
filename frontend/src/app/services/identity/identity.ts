import gravatarUrl from "gravatar-url";
import { Outfit } from "app/model/outfit";
import { ApiResult } from "shared/infrastructure";
import { IdentityTokens, IIdentityTokens } from "./identity-tokens";

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
        this.id = result.data.id;
        this.email = result.data.email;
        this.emailVerified = result.data.emailVerified;
        this.fullName = result.data.fullName;
        this.preferredName = result.data.preferredName;
        this.pictureUrl = result.data.pictureUrl;

        if (this.pictureUrl == null)
        {
            this.pictureUrl = gravatarUrl(result.data.email, { default: this.pictureUrl ?? "blank" });
        }

        if (result.data.organization != null)
        {
            this.organization = new Outfit(result.data.organization);
        }

        const accessToken = result.data.accessToken || tokens.accessToken;
        const refreshToken = result.data.refreshToken || tokens.refreshToken;

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
     * The email identifying the user.
     */
    public readonly email: string;

    /**
     * If the users email is verified.
     */
     public readonly emailVerified: boolean;

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
     * The outfit to which the user belongs, if any.
     */
    public readonly organization: Outfit | undefined;

    /**
     * The claims assigned to the user.
     */
    public readonly claims: ReadonlySet<string>;

    /**
     * The the tokens to use when accessing the API.
     */
    public tokens: IdentityTokens;
}
