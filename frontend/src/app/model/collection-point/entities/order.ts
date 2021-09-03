import { PhoneNumber } from "app/model/shared";
import { DateTimeRange } from "shared/types";
import { Collo, OrderStatus } from "..";

/**
 * Represents order of a collection point
 */
export class Order {
  /**
   * Creates a new instance of the type.
   * @param data The response data from which the instance should be created.
   */
  public constructor(data: any) {
    this.id = data.id;
    this.status = new OrderStatus(data.status ?? "ready-for-collection");
    this.creatorOrderId = data.creatorOrderId ?? data.externalId ?? "";
    this.relationalId = data.relationalId;
    this.pickupTimeFrame = new DateTimeRange(data.pickupTimeFrame, {
      setZone: true,
    });

    this.contact = {
      fullName: data.contact.fullName,
      phone:
        data.contact.phone != null
          ? new PhoneNumber(data.contact.phone)
          : undefined,
    };

    this.colli = data.colli.map((c: any) => new Collo(c));
  }

  /**
   * The unique id of the order
   */
  public id: string;

  /**
   * The id of the organization that created the order
   */
  public creatorOrderId: string;

  /**
   * Renational id is usually the sales order id
   */
  public relationalId?: string;

  /**
   * The status of the order
   */
  public status: OrderStatus;

  /**
   * The pickup timeframe this order has to be picked up within
   */
  public pickupTimeFrame: DateTimeRange;

  /**
   * The contact person of the order
   */
  public contact: { fullName?: string; phone?: PhoneNumber };

  /**
   * The colli in the order, has to be 1...x
   */
  public colli: Collo[];
}
