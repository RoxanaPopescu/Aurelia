/**
 * Represents the cost associated with a vehicle group.
 * Note that the cost values must be positive numbers, where the cost is defined
 * by the relative size of the numbers, not by their absolute values.
 */
export class VehicleGroupCost
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.newRoute = data.newRoute;
            this.time = data.time;
            this.distance = data.distance;
        }
    }

    /**
     * The cost of a new route.
     */
    public newRoute: number;

    /**
     * The cost of every minute.
     */
    public time: number;

    /**
     * The cost of every kilometer driven.
     */
    public distance: number;
}