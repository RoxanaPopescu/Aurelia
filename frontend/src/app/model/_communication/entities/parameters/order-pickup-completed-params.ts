export class OrderPickupCompletedParams
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.minutesAddedToEstimate = data.minutesAddedToEstimate;
        this.minutesAddedPriorToEstimate = data.minutesAddedPriorToEstimate;
    }

    public readonly minutesAddedToEstimate: number;

    public readonly minutesAddedPriorToEstimate;
}
