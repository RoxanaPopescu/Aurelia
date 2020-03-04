/**
 * Represents the arrival time window adjustments that are allowed,
 * in order to save cost or improve quality.
 */
export class TimeWindowAdjustment
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.start = data.start;
            this.end = data.end;
        }
    }

    /**
     * The max adjustment allowed for the earliest arrival time of the time window.
     */
    public start: number;

    /**
     * The max adjustment allowed for the latest arrival time of the time window.
     */
    public end: number;
}
