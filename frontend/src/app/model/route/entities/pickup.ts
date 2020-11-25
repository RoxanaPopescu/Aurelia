import { Consignee } from "app/model/outfit";
import { Collo } from "app/model/collo";

/**
 * Represents a pickup that must be completed at a route stop.
 */
export class Pickup
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.orderId = data.orderId;
        this.orderSlug = data.orderSlug;
        this.consignee = new Consignee(data.consignee);
        this.colli = data.colli.map(c => new Collo(c, data.orderId));
    }

    /**
     * The ID of the consignor related to this delivery.
     */
    public consignorId?: string;

    /**
     * The ID of the order related to this pickup.
     */
    public orderId?: string;

    /**
     * The slug identifying the order related to this pickup.
     */
    public orderSlug: string;

    /**
     * The party to whom the colli will be delivered.
     */
    public consignee: Consignee;

    /**
     * The colli to pick up.
     */
    public colli: Collo[];

    /**
     * The total weight of all colli to pickup, can be undefined if no colli has weight.
     * In the future all colli should have a weight and dimension!
     */
    public get totalWeight(): number | undefined
    {
        const weight = this.colli.reduce((accu, colli) => accu + (colli.weight ?? 0), 0);

        return weight > 0 ? weight : undefined;
    }

    /**
     * The total volume of colli in this pickup, can be undefined if no colli has weight.
     * In the future all colli should have a weight and dimension!
     */
    public get totalVolume(): number | undefined
    {
        const volume = this.colli.reduce((accu, colli) => accu + (colli.dimensions?.volume ?? 0), 0);

        return volume > 0 ? volume : undefined;
    }
}
