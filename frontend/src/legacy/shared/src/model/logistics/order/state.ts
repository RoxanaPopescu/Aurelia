import { OrderStatus } from "shared/src/components/order/list/models/order";

export class State {
  public isDeleted: boolean;
  public canBeCancelled: boolean;
  public canBeEdited: boolean;
  public status: OrderStatus;

  // tslint:disable-next-line:no-any
  constructor(json: any) {
    this.isDeleted = json.isDeleted;
    this.canBeCancelled = json.canBeCancelled;
    this.canBeEdited = json.canBeEdited;
    this.status = new OrderStatus(json.status.name.toLowerCase());
  }
}
