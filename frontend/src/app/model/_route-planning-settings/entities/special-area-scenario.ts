import clone from "clone";
import { SpecialAreaCriteria } from "./special-area-criteria";

/**
 * Represents a special area scenario.
 */
export class SpecialAreaScenario
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.criteria = new SpecialAreaCriteria(data.criteria);
            this.taskTimeChange = data.taskTimeChange;
            this.drivingTimeChangeFactor = data.drivingTimeChangeFactor;
            this.isAreaBlocked = data.isAreaBlocked;
        }
        else
        {
            this.criteria = new SpecialAreaCriteria();
            this.isAreaBlocked = false;
        }
    }

    /**
     * The matching criteria for the scenario.
     */
    public criteria: SpecialAreaCriteria;

    /**
     * The time to add to the task time.
     */
    public taskTimeChange: number;

    /**
     * The facter with which the driving time should be multiplied.
     */
    public drivingTimeChangeFactor: number;

    /**
     * True if the area is inaccessible, otherwise false.
     */
    public isAreaBlocked: boolean;

    /**
     * Gets a clone of this instance, suitable for editing.
     */
    public clone(): any
    {
        return clone(this);
    }
}