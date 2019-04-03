/**
 * Represents the profile for a user.
 */
export class Profile
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.email = data.email;
        this.username = data.username;
        this.fullName = data.fullName;
        this.preferredName = data.preferredName;
        this.pictureUrl = data.pictureUrl;
    }

    /**
     * The email address of the user.
     */
    public email: string;

    /**
     * The username identifying the user.
     */
    public username: string;

    /**
     * The full name of the user.
     */
    public fullName: string;

    /**
     * The preferred name of the user.
     */
    public preferredName: string;

    /**
     * The URL for the user picture.
     */
    public pictureUrl: string;
}
