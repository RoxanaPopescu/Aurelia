import { observable } from "mobx";
import { OrderGroup } from "../../../../../shared/src/model/logistics/orderGroups/orderGroup";
import Localization from "shared/src/localization";

export class OrderGroupListStore {
  @observable
  loading: boolean = true;
  @observable
  error?: string;
  @observable
  orderGroups: OrderGroup[] = [];
  headers = [
    {
      content: Localization.sharedValue("OrderGroup_TableHeader_Name"),
      key: OrderGroupListSortingKey.map.Name.slug
    },
    {
      content: Localization.sharedValue("OrderGroup_TableHeader_PostalCodes"),
      key: OrderGroupListSortingKey.map.PostalCode.slug
    },
    {
      content: Localization.sharedValue("OrderGroup_TableHeader_Consignor"),
      key: OrderGroupListSortingKey.map.Customer.slug
    },
    {
      content: Localization.sharedValue("OrderGroup_TableHeader_Tags"),
      key: OrderGroupListSortingKey.map.Tags.slug
    }
  ];
}

export class OrderGroupListSortingKey {
  public static readonly map = {
    Name: {
      slug: "Name",
      value: 1
    },
    PostalCode: {
      slug: "PostalCode",
      value: 2
    },
    Customer: {
      slug: "Customer",
      value: 3
    },
    Tags: {
      slug: "Tags",
      value: 3
    }
  };

  public constructor(status: keyof typeof OrderGroupListSortingKey.map) {
    Object.assign(this, OrderGroupListSortingKey.map[status]);
  }

  public slug: keyof typeof OrderGroupListSortingKey.map;
  public value: number;
}
