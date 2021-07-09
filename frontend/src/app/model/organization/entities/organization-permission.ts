/**
 * Represents a permnission tht may be assigned to a role within an organization.
 */
export class OrganizationPermission
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.name = data.name;
        this.area = data.area;
        this.type = data.type;
    }

    /**
     * The ID of the permission.
     */
    public id: string;

    /**
     * The name of the permission.
     */
    public name: string;

    /**
     * The name of the product area to which the permission grants access.
     */
    public area: string;

    /**
     * The type of access granted by the permission.
     */
    public type: "view" | "edit";

    /**
     * Gets the string representation of the instance.
     */
    public toString(): any
    {
        return this.name;
    }
}
