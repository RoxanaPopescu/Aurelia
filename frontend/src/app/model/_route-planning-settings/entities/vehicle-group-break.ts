import clone from "clone";
import { Uuid } from "shared/utilities/id/uuid";
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
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.type = new VehicleGroupBreakType(data.type);
            this.id = data.id;
            this.definition = data.definition;
        }
        else
        {
            this.id = Uuid.v1();
            this.type = new VehicleGroupBreakType("max-work-time");
            this.definition = ({ includeStartLocationTaskTime: false } as any);
        }
    }

    /**
     * The ID of the break.
     */
    public id: string;

    /**
     * The name of the vehicle group.
     */
    public type: VehicleGroupBreakType;

    /**
     * The break rules, in decending order of precedence
     */
    public definition: IBreakDefinition;

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
export interface IBreakDefinition
{
    /**
     * The duration of the break.
     */
    duration: number;

    /**
     * The max work time since the last break.
     */
    workTimeSinceLastBreak: number;

    /**
     * True to include task time for the start location, otherwise false.
     * Note that this is only relevant if the break has type `max-work-time`.
     */
    includeStartLocationTaskTime: boolean | undefined;
}
