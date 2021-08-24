import clone from "clone";
import { DateTime } from "luxon";
import { SearchModel } from "app/model/search-model";

/**
 * Represents a role within an organization.
 */
export class OrganizationRole
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
            this.userCount = data.userCount;
            this.createdDateTime = DateTime.fromISO(data.createdDateTime, { setZone: true });
            this.modifiedDateTime = DateTime.fromISO(data.modifiedDateTime, { setZone: true });
            this.permissions = data.permissions;
        }
    }

    /**
     * The ID of the role.
     */
    public readonly id: string;

    /**
     * The name of the role.
     */
    public name: string;

    /**
     * The number of users associated with the role.
     */
    public readonly userCount: string;

    /**
     * The date and time at which the role was created.
     */
    public readonly createdDateTime: DateTime;

    /**
     * The date and time at which the role was last modified.
     */
    public readonly modifiedDateTime: DateTime;

    /**
     * The permissions associated with the role.
     */
    public readonly permissions: string[];

    /**
     * The model representing the searchable text in the entity.
     */
    public readonly searchModel = new SearchModel(this);

    /**
     * Gets a clone of this instance, suitable for editing.
     */
    public clone(): any
    {
        return clone(this);
    }
}
