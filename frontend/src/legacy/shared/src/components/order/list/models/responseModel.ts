import { Order } from "./order";

export class OrderListResponseModel {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    this.orders = data.orders.map(order => new Order(order));
    this.totalCount = data.totalCount;
  }

  public orders: Order[];

  public totalCount: number;
}
