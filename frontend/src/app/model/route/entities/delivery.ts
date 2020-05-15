import { Consignor } from "app/model/outfit";
import { Collo } from "app/model/collo";

/**
 * Represents a delivery that must be completed at a route stop.
 */
export class Delivery
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.orderId = data.orderId;
        this.orderSlug = data.orderSlug;
        this.consignor = new Consignor(data.consignor);
        this.colli = data.colli.map(c => new Collo(c, data.orderId));
    }

    /**
     * The ID of the consignor related to this delivery.
     */
    public consignorId?: string;

    /**
     * The ID of the order related to this delivery.
     */
    public orderId?: string;

    /**
     * The slug identifying the order related to this pickup.
     */
   public orderSlug: string;

    /**
     * The party for whom the colli will be delivered.
     */
    public consignor: Consignor;

    /**
     * The colli to deliver.
     */
    public colli: Collo[];

    /**
     * The total weight of all colli deliver, can be undefined if no colli has weight.
     * In the future all colli should have a weight and dimension!
     */
    public get totalWeight(): number | undefined {
        let weight = this.colli.reduce((accu, colli) => accu += colli.weight ?? 0, 0);
        return weight > 0 ? weight : undefined;
    }

    /**
     * The total volume of colli in this delivery, can be undefined if no colli has weight.
     * In the future all colli should have a weight and dimension!
     */
    public get totalVolume(): number | undefined {
        let volume = this.colli.reduce((accu, colli) => accu += colli.dimensions?.volume ?? 0, 0);
        return volume > 0 ? volume : undefined;
    }
}
