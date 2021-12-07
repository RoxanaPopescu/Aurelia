import { textCase } from "shared/utilities";
import strings from "../resources/strings/vehicle-group-break-type.json";

/**
 * Represents the slug identifying a `VehicleGroupBreakType`.
 */
export type VehicleGroupBreakTypeSlug = keyof typeof VehicleGroupBreakType.values;

/**
 * Represents the type of a break associated with a vehicle group.
 */
export class VehicleGroupBreakType
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the order.
     */
    public constructor(slug: VehicleGroupBreakTypeSlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, VehicleGroupBreakType.values[this.slug]);
    }

    public slug: VehicleGroupBreakTypeSlug;
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
        "max-work-time":
        {
            name: strings.maxWorkTime
        }
    };
}
