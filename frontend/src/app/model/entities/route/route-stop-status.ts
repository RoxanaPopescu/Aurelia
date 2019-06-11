import { Accent } from "app/model/entities/shared";

/**
 * Represents the slug identifying a `RouteStopStatus`.
 */
export type RouteStopStatusSlug = keyof typeof RouteStopStatus.map;

/**
 * Represents the status of a route stop.
 */
export class RouteStopStatus
{
    public constructor(slug: RouteStopStatusSlug)
    {
        this.slug = slug;
        Object.assign(this, RouteStopStatus.map[slug]);
    }

    public slug: RouteStopStatusSlug;
    public name: string;
    public accent: Accent;

    public static readonly map =
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
