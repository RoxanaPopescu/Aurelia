import { PhoneNumber } from "app/model/shared";
import { DateTimeRange } from "shared/types";
import clone from "clone";
import { CollectionPoint } from "./collection-point";
import { OrderStatus } from "./order-status";
import { Collo } from "./collo";

/**
 * Represents order of a collection point
 */
export class Order
{
  /**
   * Creates a new instance of the type.
   * @param data The response data from which the instance should be created.
   */
  public constructor(data: any, collectionPoint: CollectionPoint)
  {
    this.collectionPoint = collectionPoint;
    this.id = data.id;
    this.tags = data.tags;
    this.status = new OrderStatus(data.status ?? "ready-for-collection");
    this.creatorOrderId = data.creatorOrderId ?? data.externalId ?? "";
    this.relationalId = data.relationalId;
    this.pickupTimeFrame = new DateTimeRange(data.pickupTimeFrame,
    {
      setZone: true
    });

    this.contact = { fullName: data.contact.fullName, phone: data.contact.phone != null ? new PhoneNumber(data.contact.phone) : undefined };
    this.colli = data.colli.map((c: any) => new Collo(c));
  }

  /**
   * The unique ID of the order
   */
  public id: string;

  /**
   * The collection point this order belongs to
   */
  public collectionPoint: CollectionPoint;

  /**
   * The ID of the organization that created the order
   */
  public creatorOrderId: string;

  /**
   * The renational ID, which is usually the sales order ID.
   */
  public relationalId?: string;

  /**
   * The status of the order
   */
  public status: OrderStatus;

  /**
   * The description for the deviation - status has to be a deviation
   */
  public deviationDescription: string | undefined;

  /**
   * The status of the order
   */
  public tags: string[];

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

  /**
   * Gets a clone of this instance, suitable for editing.
   */
  public clone(): any
  {
      return clone(this);
  }
}
