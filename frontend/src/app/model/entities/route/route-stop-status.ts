import { Accent } from "app/model/entities/shared";

/**
 * Represents the status of a route stop.
 */
export class RouteStopStatus
{
    public constructor(status: keyof typeof RouteStopStatus.map)
    {
        this.slug = status;
        Object.assign(this, RouteStopStatus.map[status]);
    }

    public slug: keyof typeof RouteStopStatus.map;
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
