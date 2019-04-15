import { Collo } from "../collo/collo";
import { Consignor } from "../outfit/consignor";

/**
 * Represents a delivery that must be completed at a route stop.
 */
export class Delivery
{
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
