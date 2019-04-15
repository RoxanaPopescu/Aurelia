import { Outfit } from "./outfit";

/**
 * Represents the party to whom colli are delivered.
 * The receiver of an order.
 */
export class Consignee extends Outfit
{
    public constructor(data: any)
    {
        super({ type: "consignee", ...data });
    }
}
