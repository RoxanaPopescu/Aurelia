import { textCase } from "shared/utilities";
import strategyNames from "../resources/strings/uturn-strategies.json";

/**
 * Represents the slug identifying a `UturnStrategy`.
 */
export type UturnStrategySlug = keyof typeof UturnStrategy.values;

/**
 * Represents a U-turn strategy used during route optimization.
 */
export class UturnStrategy
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the order.
     */
    public constructor(slug: UturnStrategySlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, UturnStrategy.values[this.slug]);
    }

    public slug: UturnStrategySlug;
    public name: string;

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
        "allowed":
        {
            name: strategyNames.allowed
        },
        "allowed-only-dead-ends":
        {
            name: strategyNames.allowedOnlyAtDeadEnds
        },
        "allowed-only-intersections-and-dead-ends":
        {
            name: strategyNames.allowedOnlyAtIntersectionsAndDeadEnds
        },
        "not-allowed":
        {
            name: strategyNames.notAllowed
        }
    };
}
