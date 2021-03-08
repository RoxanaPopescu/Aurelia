import { DateTime, Duration } from "luxon";
import { DateTimeRange } from "shared/types";

/**
 * Represents a estimates for a stop
 */
export class RouteEstimates
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.arrivalTime = DateTime.fromISO(data.arrivalTime, { setZone: true });
            this.completionTime = DateTime.fromISO(data.completionTime, { setZone: true });

            this.taskTime = Duration.fromObject({ seconds: data.taskTime });
            this.waitingTime = Duration.fromObject({ seconds: data.waitingTime });
            this.drivingTime = Duration.fromObject({ seconds: data.drivingTime });
        }
    }

    /**
     * The estimated time of arrival.
     */
    public readonly arrivalTime: DateTime;

    /**
     * The estimated time of completion.
     */
    public readonly completionTime: DateTime;

    /**
     * The estimated time spent loading and unloading at the stop.
     */
    public readonly taskTime?: Duration;

    /**
     * The estimated time the driver waited before he could start the taskTime
     */
    public readonly waitingTime?: Duration;

    /**
     * The estimated driving time
     */
    public readonly drivingTime?: Duration;

    /**
     * The time range of the estimate
     */
    public get timeFrame(): DateTimeRange {
        return new DateTimeRange({ from: this.arrivalTime, to: this.completionTime }, { setZone: true });
    }
}
