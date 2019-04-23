import { Driver } from "./driver";
import { Position } from "shared/src/model/general/position";
import { RouteStop } from "../routes/details";
import { Stop } from "./stop";

export class Passage {
  public routeId: string;
  public slug: string;
  public status: string;
  public driver: Driver;
  public driverPosition?: Position;
  public pickupStop?: RouteStop;
  public deliveryStop?: RouteStop;
  public pickup: Stop;
  public delivery: Stop;

  // tslint:disable-next-line:no-any
  constructor(json: any) {
    this.routeId = json.routeId;
    this.slug = json.slug;
    this.status = json.status;
    this.driver = new Driver(json.driver);
    this.driverPosition = json.driverLocationResponse
      ? new Position(json.driverLocationResponse)
      : undefined;
    this.pickup = new Stop(json.stops[0]);
    this.delivery = new Stop(json.stops[1]);
  }

  public setStops(pickup: RouteStop, delivery: RouteStop) {
    this.pickupStop = pickup;
    this.deliveryStop = delivery;
  }
}
