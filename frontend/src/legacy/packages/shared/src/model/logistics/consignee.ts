import { Outfit } from "./outfit";

/**
 * Represents the party to whom colli are delivered.
 * The receiver of an order.
 */
export class Consignee extends Outfit {
  
  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    super(data);
  }

  /**
   * The name of the outfit type.
   */
  public readonly typeName = "Consignee";
}