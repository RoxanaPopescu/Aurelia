import { DateTime } from "luxon";
import { TimeOfDay } from "shared/types";

export class Appointment
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.earliestArrivalDate = DateTime.fromISO(data.earliestArrivalDate, { setZone: true });
        this.earliestArrivalTime = TimeOfDay.fromISO(data.earliestArrivalTime);
        this.latestArrivalDate = DateTime.fromISO(data.latestArrivalDate, { setZone: true });
        this.latestArrivalTime = TimeOfDay.fromISO(data.latestArrivalTime);
    }

    public earliestArrivalDate: DateTime;

    public earliestArrivalTime: TimeOfDay;

    public latestArrivalDate: DateTime;

    public latestArrivalTime: TimeOfDay;
}
