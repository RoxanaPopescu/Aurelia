import { TimeOfWeek } from "./time-of-week";

/**
 * Represents a range of time during the week, which may optionally be open ended.
 */
export class TimeOfWeekRange
{
    /**
     * Creates a new instance of the class.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            if (data.from instanceof TimeOfWeek)
            {
                this.from = data.from;
            }
            else if (data.from != null)
            {
                this.from = new TimeOfWeek(data.from);
            }

            if (data.to instanceof TimeOfWeek)
            {
                this.to = data.to;
            }
            else if (data.to != null)
            {
                this.to = new TimeOfWeek(data.to);
            }
        }
        else
        {
            this.from = new TimeOfWeek();
            this.to = new TimeOfWeek();
        }
    }

    /**
     * The first day and time included in the range,
     * or undefined if the range has no start.
     */
    public from?: TimeOfWeek;

    /**
     * The last day and time included in the range,
     * or undefined if the range has no end.
     */
    public to?: TimeOfWeek;
}
