import { DateTime } from "luxon";

/**
 * Represents info about a route planning rule set.
 */
export class RoutePlanningSettingsInfo
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
            this.lastModified = DateTime.fromISO(data.lastModified, { setZone: true });
        }
    }

    /**
     * The ID of the route planning settings.
     */
    public id: string;

    /**
     * The name of the route planning settings.
     */
    public name: string;

    /**
     * The slug identifying the route planning settings.
     */
    public slug: string;

    /**
     * The last modified date.
     */
    public lastModified: DateTime;
}
