import { Duration } from "luxon";
import { DayOfWeek } from "app/model/shared";

/**
 * Represents the availability of a depot.
 */
export class DistributionCenterAvailability
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        this.openingTime = Duration.fromObject({ seconds: data.openingTime });
        this.closingTime = Duration.fromObject({ seconds: data.closingTime });
        this.numberOfPorts = data.numberOfPorts;
        this.daysOfWeek = data.daysOfWeek;
    }

    /**
     * The time of day at which the depot opens.
     */
    public openingTime?: Duration;

    /**
     * The time of day at which the depot closes.
     */
    public closingTime?: Duration;

    /**
     * The number of ports available.
     */
    public numberOfPorts?: number;

    /**
     * The days of the week on which this availability applies.
     */
    public daysOfWeek?: DayOfWeek[];
}
