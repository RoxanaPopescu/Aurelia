/**
 * Represents info about a route optimization rule set.
 */
export class RouteOptimizationSettingsInfo
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
            this.slug = data.slug;
        }
    }

    /**
     * The ID of the route optimization settings.
     */
    public id: string;

    /**
     * The name of the route optimization settings.
     */
    public name: string;

    /**
     * The slug identifying the route optimization settings.
     */
    public slug: string;
}
