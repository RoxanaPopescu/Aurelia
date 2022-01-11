import { Duration } from "luxon";
import { OrganizationInfo } from "app/model/organization";

/**
 * Represents a route filter to use for automatic dispatch.
 */
export class AutomaticDispatchRouteFilter
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.organizations = data.organizations.map(o => new OrganizationInfo(o));
            this.tags = data.tags;
            this.pickupLeadTime = Duration.fromObject({ seconds: data.pickupLeadTime });
        }
    }

    /**
     * The organizations to match.
     */
    public organizations: OrganizationInfo[];

    /**
     * The tags to match.
     */
    public tags: string[];

    /**
     * The max time before before the pickup time, at which a route may match.
     */
    public pickupLeadTime: Duration;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        const data =
        {
            organizationIds: this.organizations.map(o => o.id),
            tags: this.tags,
            pickupLeadTime: this.pickupLeadTime?.as("seconds")
        };

        return data;
    }
}
