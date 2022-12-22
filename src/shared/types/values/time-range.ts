import { Duration } from "luxon";

/**
 * Represents a time range, which may optionally be open ended.
 */
export class TimeRange
{
    /**
     * Creates a new instance of the class.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            if (data.from instanceof Duration)
            {
                this.from = data.from;
            }
            else if (data.from != null)
            {
                this.from = Duration.fromObject({ second: data.from });
            }

            if (data.to instanceof Duration)
            {
                this.to = data.to;
            }
            else if (data.to != null)
            {
                this.to = Duration.fromObject({ second: data.to });
            }
        }
    }

    /**
     * The first time included in the range,
     * or undefined if the range has no start time.
     */
    public from?: Duration;

    /**
     * The last time included in the range,
     * or undefined if the range has no end time.
     */
    public to?: Duration;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            from: this.from ? this.from.as("seconds") : undefined,
            to: this.to ? this.to.as("seconds") : undefined
        };
    }
}
