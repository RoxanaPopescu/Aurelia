import { Location } from "app/model/shared";

/**
 * Represents the revisit to a distribution center while en route on a vehicle group.
 * Usually happend when the vehicle has empties its colli and returns to the distribution center
 */
export class VehicleGroupDistributionCenterEnRoute
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
            this.earliestArrivalTime = data.earliestArrivalTime;
            this.latestDepartureTime = data.latestDepartureTime;
        } else {
            this.location = new Location();
        }
    }

    /**
     * The start location associated with the vehicle group.
     */
    public location: Location | undefined;

    /**
     * The task time at this revisit.
     */
    public taskTime: number | undefined;

    /**
     * The earliest arrival of the revisit.
     */
    public earliestArrivalTime: number | undefined;

    /**
     * The latest departure of the revisit.
     */
    public latestDepartureTime: number | undefined;
}
