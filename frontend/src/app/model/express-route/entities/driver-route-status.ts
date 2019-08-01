import { Accent } from "app/model/shared";

/**
 * Represents the slug identifying a `DriverRouteStatus`.
 */
export type DriverRouteStatusSlug = keyof typeof DriverRouteStatus.values;

/**
 * Represents the status of a driver route.
 */
export class DriverRouteStatus
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the route.
     */
    public constructor(slug: DriverRouteStatusSlug)
    {
        this.slug = slug;
        Object.assign(this, DriverRouteStatus.values[this.slug]);
    }

    public slug: DriverRouteStatusSlug;
    public name: string;
    public accent: Accent;

    public static readonly values =
    {
        "on-time":
        {
            name: "On time",
            accent: "neutral"
        },
        "delayed":
        {
            name: "Delayed",
            accent: "negative"
        }
    };
}
