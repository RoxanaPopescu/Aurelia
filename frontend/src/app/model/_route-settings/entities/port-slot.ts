/**
 * Represents a slot associated with a port.
 */
export class PortSlot
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.arrivalTime = data.arrivalTime;
            this.lastDepartureTime = data.lastDepartureTime;
            this.timeBetweenDepartures = data.timeBetweenDepartures;
            this.vehicleGroupId = data.vehicleGroupId;
        }
    }

    /**
     * The time at which the vehicle should arrive at the port.
     */
    public arrivalTime: string;

    /**
     * The time at which the vehicle must depart the port.
     */
    public lastDepartureTime: string;

    /**
     * The time between two arrival times, used for loading and preparing the gate for next arrival.
     */
    public timeBetweenDepartures: number;

    /**
     * The vehicle group to which the vehicle should belong.
     */
    public vehicleGroupId: string;
}
