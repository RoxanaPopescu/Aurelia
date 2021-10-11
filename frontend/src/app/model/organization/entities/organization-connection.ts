import { DateTime } from "luxon";
import { SearchModel } from "app/model/search-model";
import { OrganizationConnectionStatus } from "./organization-connection-status";

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
            this.organization = data.organization;
            this.status = new OrganizationConnectionStatus(data.status);
            this.createdDateTime = DateTime.fromISO(data.createdDateTime, { setZone: true });

            if (data.acceptedDateTime != null)
            {
                this.acceptedDateTime = DateTime.fromISO(data.acceptedDateTime, { setZone: true });
            }
        }
    }

    /**
     * The ID of the connection.
     */
    public readonly id: string;

    /**
     * The ID of the organization that is connected to the current organization.
     */
    public readonly organization: { id: string; name: string };

    /**
     * The date and time at which the connection was created.
     */
    public readonly createdDateTime: DateTime;

    /**
     * The date and time at which the connection was accepted.
     */
    public readonly acceptedDateTime: DateTime;

    /**
     * The status of the connection.
     */
    public readonly status: OrganizationConnectionStatus;

    /**
     * The model representing the searchable text in the entity.
     */
    public readonly searchModel = new SearchModel(this);
}
