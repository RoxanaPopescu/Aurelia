import { DateTime, Duration } from "luxon";
import { DateTimeRange } from "shared/types";
import { Location } from "app/model/shared";
import { Order } from "..";

/**
 * Represents a collection point with 1...x orders
 */
export class CollectionPoint
{
  /**
   * Creates a new instance of the type.
   * @param data The response data from which the instance should be created.
   */
  public constructor(data: any)
  {
    this.id = data.id;
    this.orders = data.orders.map((o: any) => new Order(o, this));
    this.location = new Location(data.location);
  }

  /**
   * The ID of the collection point
   */
  public id: string;

  /**
   * The location of the collection point
   */
   public location: Location;

  /**
   * The orders in the collection point
   */
   public orders: Order[];

  /**
   * The time range of the collection point
   */
  public get timeRange(): DateTimeRange
  {
    let minDate = DateTime.local().plus(Duration.fromObject({years: 3}));
    let maxDate = DateTime.fromSeconds(0);

    for (const order of this.orders)
    {
      if (order.pickupTimeFrame != null)
      {
        if (
          order.pickupTimeFrame.from != null &&
          order.pickupTimeFrame.from < minDate
        )
        {
          minDate = order.pickupTimeFrame.from;
        }

        if (
          order.pickupTimeFrame.to != null &&
          order.pickupTimeFrame.to > maxDate
        )
        {
          maxDate = order.pickupTimeFrame.to;
        }
      }
    }

    return new DateTimeRange({from: minDate, to: maxDate});
  }
}
