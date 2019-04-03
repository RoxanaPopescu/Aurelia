import { Outfit } from "app/domain/entities/outfit";

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
        this.username = data.username;
        this.fullName = data.fullName;
        this.preferredName = data.preferredName;
        this.pictureUrl = data.pictureUrl;
        this.outfit = new Outfit(data.outfit);
        this.roles = new Set<string>(data.roles);
    }

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
     * The roles assigned to the user.
     */
    public readonly roles: ReadonlySet<string>;
}
