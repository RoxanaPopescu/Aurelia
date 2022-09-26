
export class OrderColliInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.colliCount = data.numberOfColli;
        this.totalVolume = data.volume;
        this.totalWeight = data.weight;
    }

    public readonly colliCount: number;

    public readonly totalVolume: number;

    public readonly totalWeight: number;
}
