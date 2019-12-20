import { textCase } from "shared/utilities/text";

/**
 * Represents the slug identifying a `RouteStopType`.
 */
export type RouteStopTypeSlug = keyof typeof RouteStopType.values;

/**
 * Represents the type of a route stop.
 */
export class RouteStopType
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the type of the route stop.
     */
    public constructor(slug: RouteStopTypeSlug)
    {
        this.slug = slug ? textCase(slug, "pascal", "kebab") as any : "unknown";
        Object.assign(this, RouteStopType.values[this.slug]);
    }

    public slug: RouteStopTypeSlug;
    public name: string;

    public static readonly values =
    {
        "pickup":
        {
            name: "Pickup"
        },
        "delivery":
        {
            name: "Delivery"
        },
        "return":
        {
            name: "Return"
        },
        "unknown":
        {
            name: "Unknown"
        }
    };
}
