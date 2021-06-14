/**
 * Represents info about an organization.
 */
export class OrganizationInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.name = data.name;
    }

    /**
     * The ID of the organization.
     */
    public readonly id: string;

    /**
     * The name of the organization.
     */
    public readonly name: string;
}
