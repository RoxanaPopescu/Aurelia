import { Location } from "app/model/shared";

/**
 * Represents the start location associated with a vehicle group.
 */
export class VehicleGroupLocation
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.location = new Location(data.location);
            this.taskTime = data.taskTime;
        }
        else
        {
            this.location = new Location();
        }
    }

    /**
     * The start location.
     */
    public location: Location;

    /**
     * The task time at this location.
     */
    public taskTime: number;
}
