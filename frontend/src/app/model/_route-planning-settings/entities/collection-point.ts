/**
 * Represents the settings controlling the creation of collection points.
 */
export class CollectionPoint
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.orderTagsAllRequired = data.orderTagsAllRequired;
        }
    }

    /**
     * The order tags for which a collection point should be created,
     * or undefined if no collection points should be created.
     */
    public orderTagsAllRequired: string[] | undefined;

    /**
     * The shift to apply to the arrival time window, to allow time for preparing,
     * or undefined if no collection points should be created.
     */
    public preparationTime: number | undefined;
}
