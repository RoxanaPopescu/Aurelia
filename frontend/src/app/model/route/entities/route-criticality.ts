import { Accent } from "app/model/shared";
import { textCase } from "shared/utilities/text";

/**
 * Represents the slug identifying a `RouteCriticality`.
 */
export type RouteCriticalitySlug = keyof typeof RouteCriticality.values;

/**
 * Represents the criticality of a route, which is an indication of
 * how much attention it requires from the operations team.
 */
export class RouteCriticality
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the criticality of the route.
     */
    public constructor(slug: RouteCriticalitySlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, RouteCriticality.values[this.slug]);
    }

    public slug: RouteCriticalitySlug;
    public name: string;
    public rank: number;
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
        "high":
        {
            name: "High",
            rank: 2,
            accent: "negative"
        },
        "medium":
        {
            name: "Medium",
            rank: 1,
            accent: "attention"
        },
        "low":
        {
            name: "Low",
            rank: 0,
            accent: "neutral"
        }
    };
}
