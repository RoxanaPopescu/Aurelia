/**
 * Represents a slot associated with a gate.
 */
export class GateSlot
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.earliestArrivalTime = data.earliestArrivalTime;
            this.latestDepartureTime = data.latestDepartureTime;
            this.timeBetweenDepartures = data.timeBetweenDepartures;
            this.vehicleGroup = data.vehicleGroup;
        }
    }

    /**
     * The time at which the vehicle should arrive at the gate.
     */
    public earliestArrivalTime: number;

    /**
     * The time at which the vehicle must depart the gate.
     */
    public latestDepartureTime: number;

    /**
     * The time between two arrival times, used for loading and preparing the gate for next arrival.
     */
    public timeBetweenDepartures: number;

    /**
     * The ID of the vehicle group to which the vehicle should belong.
     */
    public vehicleGroup: number;
}
