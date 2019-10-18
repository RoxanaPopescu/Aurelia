/**
 * Represents a weight range.
 */
export class WeightRange
{
    /**
     * Creates a new instance of the class.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.from = data.from;
            this.to = data.to;
        }
    }

    /**
     * The lower limit of the weight range,
     * or undefined if the range has no end.
     */
    public from?: number;

    /**
     * The upper limit of the weight range,
     * or undefined if the range has no end.
     */
    public to?: number;
}
