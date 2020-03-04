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
            this.arrivalTime = data.arrivalTime;
            this.lastDepartureTime = data.lastDepartureTime;
            this.timeBetweenDepartures = data.timeBetweenDepartures;
            this.vehicleGroupId = data.vehicleGroupId;
        }
    }

    /**
     * The time at which the vehicle should arrive at the gate.
     */
    public arrivalTime: number;

    /**
     * The time at which the vehicle must depart the gate.
     */
    public lastDepartureTime: number;

    /**
     * The time between two arrival times, used for loading and preparing the gate for next arrival.
     */
    public timeBetweenDepartures: number;

    /**
     * The vehicle group to which the vehicle should belong.
     */
    public vehicleGroupId: number;
}
