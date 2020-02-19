import { Outfit } from "app/model/outfit";

/**
 * Represents the identity of an authenticated user.
 */
export class Identity
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.username = data.username;
        this.fullName = data.fullName;
        this.preferredName = data.preferredName;
        this.email = data.email;
        this.pictureUrl = data.pictureUrl;
        this.outfit = new Outfit(data.outfit);
        this.claims = new Set<string>(data.claims);
        this.tokens = data.tokens;
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
     * The email of the user.
     */
    public readonly email: string;

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
    public readonly tokens: { refresh: string; access: string };

    public hasClaim( claim: string ): boolean {
        return false;
    }
}
