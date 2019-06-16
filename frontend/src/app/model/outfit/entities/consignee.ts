import { Outfit } from "./outfit";

/**
 * Represents the party to whom colli are delivered.
 * The receiver of an order.
 */
export class Consignee extends Outfit
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        super({ type: "consignee", ...data });
    }
}
