import { DateTime, Duration } from "luxon";
import { TimeOfDay, DateTimeRange } from "shared/types";

export class Appointment
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        const fromDate = DateTime.fromISO(data.earliestArrivalDate, { setZone: true });
        const fromDuration = Duration.fromMillis(TimeOfDay.fromISO(data.earliestArrivalTime).valueOf());
        this.earliestArrivalDate = fromDate.plus(fromDuration)

        const toDate = DateTime.fromISO(data.latestArrivalDate, { setZone: true });
        const toDuration = Duration.fromMillis(TimeOfDay.fromISO(data.latestArrivalTime).valueOf());
        this.latestArrivalDate = toDate.plus(toDuration)
    }

    public get timeFrame(): DateTimeRange {
        return new DateTimeRange({ from: this.earliestArrivalDate, to: this.latestArrivalDate });
    }

    public earliestArrivalDate: DateTime;
    public latestArrivalDate: DateTime;


    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            earliestArrivalDate: this.earliestArrivalDate.startOf("day").toFormat("yyyy-MM-dd'T'HH:mm:ss"),
            earliestArrivalTime: this.earliestArrivalDate.toFormat("HH:mm:ss"),
            latestArrivalDate: this.latestArrivalDate.startOf("day").toFormat("yyyy-MM-dd'T'HH:mm:ss"),
            latestArrivalTime: this.latestArrivalDate.toFormat("HH:mm:ss")
        }
    }
}