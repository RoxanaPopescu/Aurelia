/**
 * Represents the limits associated with a vehicle group.
 */
export class VehicleGroupLimits
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.volume = data.volume;
            this.weight = data.weight;
            this.colliCount = data.colliCount;
            this.stopCount = data.stopCount;
            this.time = data.time;
            this.distance = data.distance;
        }
    }

    /**
     * The max volume the vehicle can handle, in ㎡.
     */
    public volume: number;

    /**
     * The max weight the vehicle can handle, in kg.
     */
    public weight: number;

    /**
     * The max number of colli the vehicle can handle.
     */
    public colliCount: number;

    /**
     * The max number of stops the vehicle can handle.
     */
    public stopCount: number;

    /**
     * The max route duration the vehicle can handle.
     */
    public time: number;

    /**
     * The max route distance the vehicle can handle.
     */
    public distance: number;
}
