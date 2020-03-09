/**
 * Represents info about a user.
 */
export class UserInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.username = data.userName;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
    }

    /**
     * The ID of the user
     */
    public id: string;

    /**
     * The first name of the user.
     */
    public username: string;

    /**
     * The first name of the user.
     */
    public firstName: string;

    /**
     * The last name of the user.
     */
    public lastName: string;

    /**
     * The email of the user.
     */
    public email: string;

    /**
     * Get the string representation of this user, which is the full name of the user.
     */
    public toString(): string
    {
        return `${this.firstName} ${this.lastName}`;
    }
}
