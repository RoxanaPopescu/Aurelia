import { textCase } from "shared/utilities/text";
import deviationNames from "../resources/strings/route-stop-deviation-names.json";

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
            name: deviationNames.nobodyAtAddress
        },
        "damaged-colli":
        {
            name: deviationNames.damagedColli
        },
        "other":
        {
            name: deviationNames.other
        },
        "refused":
        {
            name: deviationNames.refused
        },
        "wrong-address":
        {
            name: deviationNames.wrongAddress
        },
        "ramp-gate-occupied":
        {
            name: deviationNames.rampGateOccupied
        },
        "missing-items":
        {
            name: deviationNames.missingItems
        },
        "incorrectly-packed":
        {
            name: deviationNames.incorrectlyPacked
        },
        "missing-colli":
        {
            name: deviationNames.missingColli
        },
        "no-capacity-in-vehicle":
        {
            name: deviationNames.noCapacityInVehicle
        },
        "not-possible-to-leave-colli":
        {
            name: deviationNames.notPossibleToLeaveColli
        },
        "missing-equipment-to-perform-service":
        {
            name: deviationNames.missingEquipmentToPerformService
        },
        "conditions-for-service-not-met":
        {
            name: deviationNames.conditionsForServiceNotMet
        },
        "other-damage":
        {
            name: deviationNames.otherDamage
        }
    };
}
