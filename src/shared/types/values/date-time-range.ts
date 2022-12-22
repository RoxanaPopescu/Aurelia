import { DateTime, Duration, DateTimeOptions, ISOTimeOptions } from "luxon";

/**
 * Represents a data and time range, which may optionally be open ended.
 */
export class DateTimeRange
{
    /**
     * Creates a new instance of the class.
     * @param data The response data from which the instance should be created.
     * @param options The parsing options to use.
     */
    public constructor(data?: any, options?: DateTimeOptions)
    {
        if (data != null)
        {
            if (data.from instanceof DateTime)
            {
                this.from = data.from;
            }
            else if (data.from != null)
            {
                this.from = DateTime.fromISO(data.from, options);
            }

            if (data.to instanceof DateTime)
            {
                this.to = data.to;
            }
            else if (data.to != null)
            {
                this.to = DateTime.fromISO(data.to, options);
            }
        }
    }

    /**
     * The first date and time included in the range,
     * or undefined if the range has no start date.
     */
    public from?: DateTime;

    /**
     * The last date and time included in the range,
     * or undefined if the range has no end date.
     */
    public to?: DateTime;

    /**
     * The duration of the range.
     */
    public get duration(): Duration
    {
        if (!this.from || !this.to)
        {
            return Duration.fromMillis(0);
        }

        return this.to.diff(this.from);
    }

    /**
     * Returns true if this range starts before the specified date, otherwise false.
     */
    public startsBefore(dateTime: DateTime | undefined): boolean | undefined
    {
        if (!this.from && !dateTime)
        {
            return false;
        }

        if (!this.from && dateTime)
        {
            return true;
        }

        if (this.from && !dateTime)
        {
            return false;
        }

        return this.from!.diff(dateTime!).valueOf() < 0;
    }

    /**
     * Returns true if this range ends after the specified date, otherwise false.
     */
    public endsAfter(dateTime: DateTime | undefined): boolean | undefined
    {
        if (!this.to && !dateTime)
        {
            return false;
        }

        if (!this.to && dateTime)
        {
            return true;
        }

        if (this.to && !dateTime)
        {
            return false;
        }

        return this.to!.diff(dateTime!).valueOf() > 0;
    }

    /**
     * Gets the data representing this instance.
     * @param options The formatting options to use.
     */
    public toJSON(options?: ISOTimeOptions): any
    {
        return {
            from: this.from ? this.from.toISO(options) : undefined,
            to: this.to ? this.to.toISO(options) : undefined
        };
    }
}
