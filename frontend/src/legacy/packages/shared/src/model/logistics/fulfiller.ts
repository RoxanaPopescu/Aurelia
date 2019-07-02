import { Outfit } from "./outfit";

/**
 * Represents the entity that fulfills the transportation of an order.
 * This can be a logistics company, a carrier or a haulier.
 */
export class Fulfiller extends Outfit {

  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    super(data);
  }

  /**
   * The name of the outfit type.
   */
  public readonly typeName = "Fulfiller";
}