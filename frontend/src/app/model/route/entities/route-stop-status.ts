import { Accent } from "app/model/shared";
import { textCase } from "shared/utilities/text";
import statusNames from "../resources/strings/route-stop-status-names.json";

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
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, RouteStopStatus.values[this.slug]);
    }

    public slug: RouteStopStatusSlug;
    public name: string;
    public accent: Accent;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return this.slug;
    }

    /**
     * The supported values.
     */
    public static readonly values =
    {
        "not-visited":
        {
            name: statusNames.notVisited,
            accent: "neutral"
        },
        "arrived":
        {
            name: statusNames.arrived,
            accent: "neutral"
        },
        "failed":
        {
            name: statusNames.failed,
            accent: "negative"
        },
        "completed":
        {
            name: statusNames.completed,
            accent: "positive"
        },
        "cancelled":
        {
            name: statusNames.cancelled,
            accent: "neutral"
        }
    };
}
