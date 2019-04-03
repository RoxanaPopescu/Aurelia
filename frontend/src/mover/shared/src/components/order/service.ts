import Localization from "../../localization";
import Base from "../../services/base";
import { SaveOrder } from "./save/store";
import { Order } from "shared/src/model/logistics/order";
import { Journey } from "../../model/logistics/order/journey";
import { OrderListSorting, OrdersListSortingMap } from "./list/store";
import { OrderListResponseModel } from "./list/models/responseModel";
import { OrderStatus } from "./list/models/order";
import { SortingDirectionMap } from "shared/src/model/general/sorting";

export default class OrderService {
  /*
  ** API call to create an order
  */
  static async place(generalOrder: SaveOrder, orders: SaveOrder[]) {
    try {
      // tslint:disable-next-line:no-any
      let items: { [Key: string]: any } = {
        generalInformation: {
          order: generalOrder.toJson()
        },
        orders: orders.map(order => order.toJson()),
        consignorId: generalOrder.consignorId
      };

      let response = await fetch(
        Base.url("PlaceOrders", {}),
        Base.defaultConfig(items)
      );

      if (response.status >= 200 && response.status < 300) {
        return true;
      } else {
        let responseJson = await response.json();
        if (
          responseJson.status === 401 ||
          responseJson.status === 422 ||
          responseJson.status === 500
        ) {
          throw new Error(responseJson.message);
        } else {
          throw new Error(Localization.sharedValue("Error_General"));
        }
      }
    } catch (error) {
      throw error;
    }
  }

  /*
  ** API call to update an order's informations
  */
  static async update(order: SaveOrder) {
    try {
      let response = await fetch(
        Base.url("EditOrder", {}),
        Base.defaultConfig(order.toJson())
      );

      if (response.status >= 200 && response.status < 300) {
        return true;
      } else {
        let responseJson = await response.json();
        if (
          responseJson.status === 401 ||
          responseJson.status === 422 ||
          responseJson.status === 500
        ) {
          throw new Error(responseJson.message);
        } else {
          throw new Error(Localization.sharedValue("Error_General"));
        }
      }
    } catch (error) {
      throw error;
    }
  }

  /*
  ** API call to get an order's informations
  */
  static async details(id: string) {
    var items = {
      id: id
    };

    let response = await fetch(
      Base.url("OrderDetails", items),
      Base.defaultConfig()
    );

    let responseJson = await response.json();

    try {
      return new Order(responseJson);
    } catch {
      if (response.status === 400) {
        throw new Error(Localization.sharedValue("Order_OrderNotFound"));
      } else {
        throw new Error(Localization.sharedValue("Error_General"));
      }
    }
  }

  /*
  ** API call to cancel an order
  */
  static async cancel(id: string) {
    var items = {
      orderId: id
    };

    let response = await fetch(
      Base.url("CancelOrder", {}),
      Base.defaultConfig(items)
    );

    try {
      if (response.ok) {
        return true;
      } else {
        throw new Error(Localization.sharedValue("Error_General"));
      }
    } catch {
      throw new Error(Localization.sharedValue("Error_General"));
    }
  }

  /*
  ** API call to get a journey's information from order id
  */
  static async getJourney(orderId: string) {
    var items = {
      orderId: orderId
    };

    let response = await fetch(
      Base.url("JourneyDetails", items),
      Base.defaultConfig()
    );

    let responseJson = await response.json();

    try {
      return new Journey(responseJson);
    } catch {
      if (response.status === 400) {
        throw new Error(Localization.sharedValue("Order_OrderNotFound"));
      } else {
        throw new Error(Localization.sharedValue("Error_General"));
      }
    }
  }

  /*
  ** API call to get a list of orders
  */
  static async list(
    page: number,
    pageSize: number,
    filter: string[],
    status: OrderStatus,
    sorting?: OrderListSorting
  ) {
    // tslint:disable-next-line:no-any
    let items: { [Key: string]: any } = {
      page: page,
      pageSize: pageSize,
      filter: filter
    };

    if (status.slug !== OrderStatus.map.all.slug) {
      if (status.slug === OrderStatus.map.placed.slug) {
        items.status = [status.value, OrderStatus.map.validated.value];
      } else {
        items.status = [status.value];
      }
    }

    // Status sorting is not supported in the backend
    if (sorting !== undefined && sorting.key !== "Status") {
      items.sorting = [
        {
          field: new OrdersListSortingMap(sorting.key).id,
          direction: new SortingDirectionMap(sorting.direction).id
        }
      ];
    }

    let response = await fetch(
      Base.url("orderlist", {}),
      Base.defaultConfig(items)
    );

    if (response.ok) {
      let responseJson = await response.json();
      return new OrderListResponseModel(responseJson);
    } else {
      throw new Error(Localization.sharedValue("Error_General"));
    }
  }
}
