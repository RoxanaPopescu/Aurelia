import { Outfit } from "./outfit";

/**
 * Represents the party who originates a shipment of colli.
 * The sender of an order, usually the seller.
 */
export class Consignor extends Outfit {

  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    super(data);
  }

  /**
   * The name of the outfit type.
   */
  public readonly typeName = "Consignor";
}
