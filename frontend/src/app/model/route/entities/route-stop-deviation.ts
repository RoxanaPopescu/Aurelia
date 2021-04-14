import { textCase } from "shared/utilities/text";

/**
 * Represents the slug identifying a `RouteStopDeviation`.
 */
export type RouteStopDeviationSlug = keyof typeof RouteStopDeviation.values;

/**
 * Represents a deviation associated with a route stop.
 */
export class RouteStopDeviation
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.slug = textCase(data.type, "pascal", "kebab") as RouteStopDeviationSlug;
        Object.assign(this, RouteStopDeviation.values[this.slug]);
        this.description = data.description;
        this.imageUrls = data.imageUrls;
        this.barcodes = data.barcodes;
    }

    public slug: RouteStopDeviationSlug;
    public name: string;
    public description: string;
    public imageUrls: string[];
    public barcodes: string[];

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
        "nobody-at-address":
        {
            name: "Nobody at address"
        },
        "damaged-colli":
        {
            name: "Damaged colli"
        },
        "other":
        {
            name: "Other problem"
        },
        "refused":
        {
            name: "Refused"
        },
        "wrong-address":
        {
            name: "Wrong address"
        },
        "ramp-gate-occupied":
        {
            name: "Ramp gate occupied"
        },
        "missing-items":
        {
            name: "Missing items"
        },
        "incorrectly-packed":
        {
            name: "Incorrectly packed"
        },
        "missing-colli":
        {
            name: "Missing colli"
        },
        "no-capacity-in-vehicle":
        {
            name: "No capacity in vehicle"
        },
        "not-possible-to-leave-colli":
        {
            name: "Not possible to leave colli"
        },
        "other-damage":
        {
            name: "Other damage"
        }
    };
}
