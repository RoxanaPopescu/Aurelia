import { DateTimeRange } from "shared/types";
import { DayOfWeek } from "app/model/shared";

/**
 * Represents the matching criteria for a departure time scenario.
 */
export class DepartureTimeCriteria
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.weekdays = data.weekdays;
            this.datePeriod = new DateTimeRange(data.datePeriod, { setZone: true });
        }
        else
        {
            this.datePeriod = new DateTimeRange();
        }
    }

    /**
     * The weekdays matched by this criteria.
     */
    public weekdays: DayOfWeek[];

    /**
     * The date range matched by this criteria.
     */
    public datePeriod: DateTimeRange;
}
