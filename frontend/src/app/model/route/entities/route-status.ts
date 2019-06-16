import { Accent } from "app/model/shared";

/**
 * Represents the slug identifying a `RouteStatus`.
 */
export type RouteStatusSlug = keyof typeof RouteStatus.values;

/**
 * Represents the status of a route.
 */
export class RouteStatus
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the route.
     */
    public constructor(slug: RouteStatusSlug)
    {
        this.slug = slug;
        Object.assign(this, RouteStatus.values[slug]);
    }

    public slug: RouteStatusSlug;
    public name: string;
    public accent: Accent;
    public value: number;

    public static readonly values =
    {
        "requested":
        {
            name: "Requested",
            accent: "attention",
            value: 1
        },
        "accepted":
        {
            name: "Accepted",
            accent: "attention",
            value: 2
        },
        "assigned":
        {
            name: "Assigned",
            accent: "neutral",
            value: 3
        },
        "started":
        {
            name: "Started",
            accent: "neutral",
            value: 4
        },
        "completed":
        {
            name: "Completed",
            accent: "positive",
            value: 20
        },
        "cancelled":
        {
            name: "Cancelled",
            accent: "neutral",
            value: 100
        }
    };
}
