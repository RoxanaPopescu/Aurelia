/**
 * Represents a dimension of any object, could be a colli or vehicle inner dimension.
 */
export class Dimensions
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.width = data.width;
        this.length = data.length;
        this.height = data.height;
    }

    /**
     * The width of the vehicle in meters.
     */
    public width: number;

    /**
     * The lenght of the vehicle in meters.
     */
    public length: number;

    /**
     * The height of the vehicle in meters.
     */
    public height: number;
}
