import { Consignor } from "app/model/outfits";
import { Collo } from "app/model/colli";

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
        this.colli = data.colli.map(c => new Collo(c, data.orderId));
    }

    /**
     * The ID of the order related to this delivery.
     */
    public orderId: string;

    /**
     * The party for whom the colli will be delivered.
     */
    public consignor: Consignor;

    /**
     * The colli to deliver.
     */
    public colli: Collo[];
}
