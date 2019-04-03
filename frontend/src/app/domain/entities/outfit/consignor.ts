import { Outfit } from "./outfit";

/**
 * Represents the party who originates a shipment of colli.
 * The sender of an order, usually the seller.
 */
export class Consignor extends Outfit
{
    public constructor(data: any)
    {
        super({ type: "consignor", ...data });
    }
}
