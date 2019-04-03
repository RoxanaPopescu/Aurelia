import BaseService from "shared/src/services/base";
import { Fulfiller } from "shared/src/model/logistics/fulfiller";
import { Order } from "shared/src/model/logistics/order";

export class OrderDispatchService {
  public async getFulfillers(): Promise<Fulfiller[]> {
    const response = await fetch(
      BaseService.url("dispatch/getFulfillers"),
      BaseService.defaultConfig()
    );

    if (!response.ok) {
      throw new Error("Could not get the list of fulfillers.");
    }

    const data = await response.json();

    return data.map(f => new Fulfiller(f));
  }

  public async assignFulfiller(
    order: Order,
    fulfiller: Fulfiller
  ): Promise<void> {
    const response = await fetch(
      BaseService.url("dispatch/order/assignFulfiller"),
      BaseService.defaultConfig({
        orderId: order.internalOrderId,
        fulfillerId: fulfiller.id,
        currentFulfillerId: order.fulfillerId
      })
    );

    if (!response.ok) {
      throw new Error("Could not assign the fulfiller to the order.");
    }

    order.allowAssignment = false;
  }
}

export const orderDispatchService = new OrderDispatchService();
