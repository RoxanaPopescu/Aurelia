import { Accent } from "app/model/shared";

/**
 * Represents the slug identifying a `RouteStopStatus`.
 */
export type RouteStopStatusSlug = keyof typeof RouteStopStatus.values;

/**
 * Represents the status of a route stop.
 */
export class RouteStopStatus
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the route stop.
     */
    public constructor(slug: RouteStopStatusSlug)
    {
        this.slug = slug;
        Object.assign(this, RouteStopStatus.values[slug]);
    }

    public slug: RouteStopStatusSlug;
    public name: string;
    public accent: Accent;

    public static readonly values =
    {
        "not-visited":
        {
            name: "Not visited",
            accent: "neutral"
        },
        "arrived":
        {
            name: "Arrived",
            accent: "neutral"
        },
        "delivery-not-possible":
        {
            name: "Delivery not possible",
            accent: "negative"
        },
        "completed":
        {
            name: "Completed",
            accent: "positive"
        },
        "cancelled":
        {
            name: "Cancelled",
            accent: "negative"
        },
        "cancelled-by-user":
        {
            name: "Cancelled by user",
            accent: "negative"
        },
        "cancelled-by-driver":
        {
            name: "Cancelled by driver",
            accent: "negative"
        },
        "cancelled-by-system":
        {
            name: "Cancelled by system",
            accent: "neutral"
        }
    };
}
