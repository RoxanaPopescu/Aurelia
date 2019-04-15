import { Outfit } from "./outfit";

/**
 * Represents the entity that fulfills the transportation of an order.
 * This can be a logistics company, a carrier or a haulier.
 */
export class Fulfiller extends Outfit
{
    public constructor(data: any)
    {
        super({ type: "fulfiller", ...data });
    }
}
