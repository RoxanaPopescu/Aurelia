import { DateTimeRange } from "shared/types";
import { DayOfWeek } from "app/model/shared";

/**
 * Represents the matching criteria for a special area scenario.
 */
export class SpecialAreaCriteria
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
            this.orderTagsAllRequired = data.orderTagsAllRequired;
            this.orderTagsOneRequired = data.orderTagsOneRequired;
        }
        else
        {
            this.weekdays = [];
            this.datePeriod = new DateTimeRange();
            this.orderTagsAllRequired = [];
            this.orderTagsOneRequired = [];
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

    /**
     * The order tags matched by this criteria, where all the specified tags must match.
     */
    public orderTagsAllRequired: string[];

    /**
     * The order matched by this criteria, where at least one of the specified tags match.
     */
    public orderTagsOneRequired: string[];
}
