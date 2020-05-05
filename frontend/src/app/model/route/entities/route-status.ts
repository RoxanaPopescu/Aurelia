import { Accent } from "app/model/shared";
import { textCase } from "shared/utilities/text";

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
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, RouteStatus.values[this.slug]);
    }

    public slug: RouteStatusSlug;
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
        "not-started":
        {
            name: "Not started",
            accent: "neutral",
            value: 1
        },
        "in-progress":
        {
            name: "In progress",
            accent: "attention",
            value: 2
        },
        "not-approved":
        {
            name: "Not approved",
            accent: "attention",
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
            accent: "negative",
            value: 100
        }
    };
}
