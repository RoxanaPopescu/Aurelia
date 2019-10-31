import { ClaimGroup } from "./claim-group";
import { RoleInfo } from "./role-info";

/**
 * Represents the role of a user.
 */
export class Role extends RoleInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        super(data);

        if (data != null)
        {
            this.claimGroups = data.claimGroups.map(g => new ClaimGroup(g));
        }
        else
        {
            this.claimGroups = [];
        }
    }

    /**
     * The claim groups associated with the role.
     */
    public claimGroups: ClaimGroup[];

    /**
     * Creates a clone of this instance, suitable for editing.
     */
    public clone(): Role
    {
        const role = new Role();
        role.id = this.id;
        role.name = this.name;
        role.claimGroups = this.claimGroups;

        return role;
    }

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            id: this.id,
            name: this.name,
            claimGroupIds: this.claimGroups.map(g => g.id)
        };
    }
}
