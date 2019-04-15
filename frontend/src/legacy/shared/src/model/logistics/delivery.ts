import { Collo } from "./collo";

/**
 * Represents a delivery that must be completed at a route stop.
 */
export class Delivery {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    this.orderId = data.orderId;
    this.colli = data.colli.map(c => new Collo(c, data.orderId));
  }

  /**
   * The ID of the order related to this delivery.
   */
  public orderId: string;

  /**
   * The colli to deliver.
   */
  public colli: Collo[];
}
