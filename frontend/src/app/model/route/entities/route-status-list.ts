import { Accent } from "app/model/shared";
import { textCase } from "shared/utilities/text";

/**
 * Represents the slug identifying a `RouteStatus`.
 */
export type RouteStatusListSlug = keyof typeof RouteStatusList.values;

/**
 * Represents the status of a route list.
 * This is temporarily and will be removed when we only have one status
 */
export class RouteStatusList
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the route.
     */
    public constructor(slug: RouteStatusListSlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, RouteStatusList.values[this.slug]);
    }

    public slug: RouteStatusListSlug;
    public name: string;
    public accent: Accent;
    public value: number;

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
        "requested":
        {
            name: "Unassigned",
            accent: "attention",
            value: 1
        },
        "accepted":
        {
            name: "Not started",
            accent: "attention",
            value: 2
        },
        "started":
        {
            name: "In progress",
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
