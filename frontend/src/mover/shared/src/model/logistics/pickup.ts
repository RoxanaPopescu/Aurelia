import { Consignee } from "./consignee";
import { Collo } from "./collo";

/**
 * Represents a pickup that must be completed at a route stop.
 */
export class Pickup {

  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    this.orderId = data.orderId;
    this.consignee = new Consignee(data.consignee);
    this.colli = data.colli.map(c => new Collo(c, data.orderId));
  }

  /**
   * The ID of the order related to this pickup.
   */
  public orderId: string;

  /**
   * The party to whom the colli will be delivered.
   */
  public consignee: Consignee;

  /**
   * The colli to pick up.
   */
  public colli: Collo[];
}
