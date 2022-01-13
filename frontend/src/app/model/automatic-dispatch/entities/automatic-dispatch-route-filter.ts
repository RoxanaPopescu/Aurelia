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
            this.organizations = data.organizations?.map(o => new OrganizationInfo(o));
            this.tags = data.tags;
        }
    }

    /**
     * The organizations to match, if any.
     */
    public organizations: OrganizationInfo[] | undefined;

    /**
     * The tags to match, if any.
     */
    public tags: string[] | undefined;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        const data =
        {
            organizationIds: this.organizations?.map(o => o.id),
            tags: this.tags
        };

        return data;
    }
}
