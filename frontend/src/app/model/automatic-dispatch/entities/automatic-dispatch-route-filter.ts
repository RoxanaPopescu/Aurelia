import { Duration } from "luxon";

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
            this.organizationIds = data.organizationIds;
            this.tags = data.tags;
            this.startLeadTime = Duration.fromObject({ seconds: data.startLeadTime });
        }
    }

    /**
     * The organization IDs to match, if any.
     */
    public organizationIds: string[] | undefined;

    /**
     * The tags to match, if any.
     */
    public tags: string[] | undefined;

    /**
     * The max time before the route start time, at which a route may match.
     */
    public startLeadTime: Duration;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        const data =
        {
            organizationIds: this.organizationIds,
            tags: this.tags,
            startLeadTime: this.startLeadTime?.as("seconds")
        };

        return data;
    }
}
