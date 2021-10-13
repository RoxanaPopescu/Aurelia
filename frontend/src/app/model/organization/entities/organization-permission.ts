import { IPermission } from "app/modules/organization/modules/roles/modals/edit-role/components/permissions/permissions";

/**
 * Represents a permission tht may be assigned to a role within an organization.
 */
export class OrganizationPermission implements IPermission
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.slug = data.slug;
        this.name = data.name;
        this.group = data.group;

        // HACK: The frontend doesn't supports the types `create` and `delete`.
        this.type = data.type === "create" || data.type === "edit" || data.type === "delete" ? "edit" : data.type;
    }

    /**
     * The slug identifying the permission.
     */
    public slug: string;

    /**
     * The type of access granted by the permission.
     */
    public type: "view" | "edit";

    /**
     * The localized name of the permission.
     */
    public name: string;

    /**
     * The name of the group to which the permission belongs.
     */
    public group: string;

    /**
     * Gets the string representation of the instance.
     */
    public toString(): any
    {
        return this.name;
    }

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return this.slug;
    }
}
