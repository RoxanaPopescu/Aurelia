import { Accent } from "app/model/shared";
import { textCase } from "shared/utilities/text";

/**
 * Represents the slug identifying a `VehicleStatus`.
 */
export type VehicleStatusSlug = keyof typeof VehicleStatus.values;

/**
 * Represents the status of a vehicle.
 */
export class VehicleStatus
{
    /**
     * Creates a new instance of the type.
     * @param slug The slug identifying the status of the vehicle.
     */
    public constructor(slug: VehicleStatusSlug)
    {
        this.slug = textCase(slug, "pascal", "kebab") as any;
        Object.assign(this, VehicleStatus.values[this.slug]);
    }

    public slug: VehicleStatusSlug;
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
        "approved":
        {
            name: "Approved",
            accent: "positive"
        },
        "not-approved":
        {
            name: "Not approved",
            accent: "neutral"
        },
        "waiting-for-approval":
        {
            name: "Waiting for approval",
            accent: "negative"
        }
    };
}
