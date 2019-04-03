import { DateTime, Duration, DateTimeOptions, ISOTimeOptions } from "luxon";

/**
 * Represents a time range, defined by a start and end date and time.
 */
export class DateTimeRange
{
    public constructor(data: any, options?: DateTimeOptions)
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

    public toJSON(options?: ISOTimeOptions): object
    {
        return {
            from: this.from ? this.from.toISO(options) : undefined,
            to: this.to ? this.to.toISO(options) : undefined
        };
    }
}
