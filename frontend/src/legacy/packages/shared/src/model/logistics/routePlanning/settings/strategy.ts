import { textCase } from "shared/utilities";

/**
 * Represents the slug identifying a `RoutePlanStrategy`.
 */
export type RoutePlanStrategySlug = keyof typeof RoutePlanStrategy.values;

export class RoutePlanStrategy
{
    /**
     * Creates a new instance of the type.
     * @param name The slug identifying the status of the route.
     */
    public constructor(name: RoutePlanStrategySlug)
    {
        console.log(name, this.slug)
        this.slug = textCase(name, "pascal", "kebab") as any;
        Object.assign(this, RoutePlanStrategy.values[this.slug]);
    }

    public slug: RoutePlanStrategySlug;
    public name: string;
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
        "long-routes":
        {
            name: "Lange ruter",
            value: 1
        },
        "short-routes":
        {
            name: "Korte ruter",
            value: 2
        },
        "no-depots":
        {
            name: "Uden distributionscenter",
            value: 5
        },
        "quick":
        {
            name: "Hurtig ruteoptimering",
            value: 3
        },
        "many-pickups-one-delivery":
        {
            name: "Afhetning til distributionscenter",
            value: 4
        }
    };
}
