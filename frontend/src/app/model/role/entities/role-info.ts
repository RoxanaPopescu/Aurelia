/**
 * Represents info about the role of a user.
 */
export class RoleInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.id = data.id;
            this.name = data.name;
        }
    }

    /**
     * The ID of the role
     */
    public id: string;

    /**
     * The name of the role.
     */
    public name: string;
}
