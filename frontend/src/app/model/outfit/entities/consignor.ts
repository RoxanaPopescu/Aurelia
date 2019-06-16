import { Outfit } from "./outfit";

/**
 * Represents the party who originates a shipment of colli.
 * The sender of an order, usually the seller.
 */
export class Consignor extends Outfit
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        super({ type: "consignor", ...data });
    }
}
