import { textCase } from "shared/utilities";
import approachStrategies from "../resources/strings/curb-approach-strategies.json"

/**
 * Represents the slug identifying a `CurbApproachStrategy`.
 */
export type CurbApproachStrategySlug = keyof typeof CurbApproachStrategy.values;

/**
 * Represents a curb-approach strategy used during route optimization.
 */
export class CurbApproachStrategy
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the order.
     */
    public constructor(slug: CurbApproachStrategySlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, CurbApproachStrategy.values[this.slug]);
    }

    public slug: CurbApproachStrategySlug;
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
        "either-side-of-vehicle":
        {
            name: approachStrategies.eitherSideOfVehicle
        },
        "right-side-of-vehicle":
        {
            name: approachStrategies.rightSideOfVehicle
        },
        "left-side-of-vehicle":
        {
            name: approachStrategies.leftSideOfVehicle
        },
        "no-uturn":
        {
            name: approachStrategies.noUturn
        }
    };
}
