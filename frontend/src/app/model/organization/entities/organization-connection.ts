import { DateTime } from "luxon";
import { SearchModel } from "app/model/search-model";

/**
 * Represents a connection between two organization.
 */
export class OrganizationConnection
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
            this.fromOrganization = data.fromOrganization;
            this.toOrganization = data.toOrganization;
            this.createdDateTime = DateTime.fromISO(data.createdAt, { setZone: true });
            this.acceptedDateTime = DateTime.fromISO(data.acceptedAt, { setZone: true });
        }
    }

    /**
     * The ID of the connection.
     */
    public readonly id: string;

    /**
     * The ID of the first organization.
     */
    public readonly fromOrganization: { id: string; name: string };

    /**
     * The ID of the second organization.
     */
    public readonly toOrganization: { id: string; name: string };

    /**
     * The date and time at which the connection was created.
     */
    public readonly createdDateTime: DateTime;

    /**
     * The date and time at which the connection was accepted.
     */
    public readonly acceptedDateTime: DateTime;

    /**
     * The model representing the searchable text in the entity.
     */
    public readonly searchModel = new SearchModel(this);
}
