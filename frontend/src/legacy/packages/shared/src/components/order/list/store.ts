import { observable } from "mobx";
import { Order, OrderStatus } from "./models/order";
import Localization from "../../../localization";
import { SortingDirection } from "shared/src/model/general/sorting";

export class OrderListStore {
  @observable loading: boolean = true;
  @observable sortLoading: boolean = false;
  @observable totalCount: number = 0;
  @observable error?: string;
  @observable orders: Order[] = [];
  @observable searchQueries?: string;
  @observable orderStatusFilter: OrderStatus = new OrderStatus("all");
  @observable pages: number = 20;
  @observable pageIndex: number = 0;
  @observable resultsPerPage: number = 40;
  @observable sorting = new OrderListSorting("OrderId", "Descending");

  headers: { content: string; key: OrdersListSortingKey }[] = [
    {
      content: Localization.consignorValue("Order_TableHeader_Id"),
      key: "OrderId"
    },
    {
      content: Localization.consignorValue("Order_TableHeader_Status"),
      key: "Status"
    },
    {
      content: Localization.consignorValue("Order_TableHeader_Date"),
      key: "DeliveryEarliestDate"
    },
    {
      content: Localization.consignorValue("Order_TableHeader_PickupTimeframe"),
      key: "PickupEarliestTime"
    },
    {
      content: Localization.consignorValue("Order_TableHeader_PickupAddress"),
      key: "ConsignorAddress"
    },
    {
      content: Localization.consignorValue("Order_TableHeader_DeliveryAddress"),
      key: "ConsigneeAddress"
    }
  ];

  clear() {
    this.orders = [];
    this.loading = true;
  }
}

export type OrdersListSortingKey =
  | "OrderId"
  | "ConsignorId"
  | "ConsignorCompanyName"
  | "ConsignorAddress"
  | "ConsignorPhoneNumber"
  | "PickupEarliestDate"
  | "PickupEarliestTime"
  | "PickupLastestDate"
  | "PickupLatestTime"
  | "ConsigneePersonName"
  | "ConsigneeCompanyName"
  | "ConsigneeAddress"
  | "ConsigneePhoneNumber"
  | "DeliveryEarliestDate"
  | "DeliveryEarliestTime"
  | "DeliveryLatestDate"
  | "DeliveryLatestTime"
  | "EstimatedColli"
  | "ActualColli"
  | "Status";

export class OrdersListSortingMap {
  public static readonly map = {
    OrderId: {
      id: 1
    },
    ConsignorId: {
      id: 2
    },
    ConsignorAddress: {
      id: 3
    },
    ConsignorCompanyName: {
      id: 4
    },
    ConsignorPhoneNumber: {
      id: 5
    },
    PickupEarliestDate: {
      id: 6
    },
    PickupEarliestTime: {
      id: 7
    },
    PickupLastestDate: {
      id: 8
    },
    PickupLatestTime: {
      id: 9
    },
    ConsigneePersonName: {
      id: 10
    },
    ConsigneeCompanyName: {
      id: 11
    },
    ConsigneeAddress: {
      id: 12
    },
    ConsigneePhoneNumber: {
      id: 13
    },
    DeliveryEarliestDate: {
      id: 14
    },
    DeliveryEarliestTime: {
      id: 15
    },
    DeliveryLatestDate: {
      id: 16
    },
    DeliveryLatestTime: {
      id: 176
    },
    EstimatedColli: {
      id: 18
    },
    ActualColli: {
      id: 19
    },
    Status: {
      id: 20
    }
  };

  public constructor(status: keyof typeof OrdersListSortingMap.map) {
    this.slug = status;
    Object.assign(this, OrdersListSortingMap.map[status]);
  }

  public slug: keyof typeof OrdersListSortingMap.map;
  public id: number;
}

export class OrderListSorting {
  key: OrdersListSortingKey;
  direction: SortingDirection;

  constructor(key: OrdersListSortingKey, direction: SortingDirection) {
    this.key = key;
    this.direction = direction;
  }
}
