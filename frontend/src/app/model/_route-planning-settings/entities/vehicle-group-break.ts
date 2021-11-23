import clone from "clone";
import { VehicleGroupBreakType } from "./vehicle-group-break-type";

/**
 * Represents break settings associated with a vehicle group.
 */
export class VehicleGroupBreak
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.type = new VehicleGroupBreakType(data.type);
        this.rules = data.rules ?? [];
    }

    /**
     * The name of the vehicle group.
     */
    public type: VehicleGroupBreakType;

    /**
     * True to include task time for the start location, otherwise false.
     * Note that this is only relevant if the break has type `max-work-time`.
     */
    public includeStartLocationTaskTime: boolean | undefined;

    /**
     * The break rules, in decending order of precedence
     */
    public rules: (IMaxWorkTimeSettings)[];

    /**
     * Gets a clone of this instance, suitable for editing.
     */
    public clone(): any
    {
        return clone(this);
    }
}

/**
 * Represents the settings for a break rule of type `max-work-time`.
 */
export interface IMaxWorkTimeSettings
{
    /**
     * The duration of the break.
     */
    duration: number;

    /**
     * The max work time since the last break.
     */
    workTimeSinceLastBreak: number;
}
