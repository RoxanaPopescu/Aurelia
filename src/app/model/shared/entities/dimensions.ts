/**
 * Represents a dimension of an object.
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
     * The width in meters.
     */
    public width: number;

    /**
     * The lenght in meters.
     */
    public length: number;

    /**
     * The height in meters.
     */
    public height: number;

    /**
     * The volume in cubic meters.
     */
    public get volume(): number
    {
        return this.width * this.length * this.height;
    }

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            width: this.width,
            height: this.height,
            length: this.length
        };
    }
}
