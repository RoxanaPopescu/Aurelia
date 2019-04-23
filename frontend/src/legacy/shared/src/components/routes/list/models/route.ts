import { DateTime } from "luxon";
import { RouteStatus } from "shared/src/model/logistics/routes";
import { Fulfiller } from "shared/src/model/logistics/fulfiller";
import { Address } from "shared/src/model/general/address";

export class Route {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    this.id = data.publicId;
    this.reference = data.routeReference;
    this.status = new RouteStatus(data.status);
    this.fulfiller =
      data.fulfiller != null ? new Fulfiller(data.fulfiller) : undefined;
    this.startDateTime = DateTime.fromISO(data.startDateTime);
    this.startAddress = new Address({ primary: data.pickupAddress });
    this.stopCount = data.stopCount;
  }

  /**
   * The unique ID of the route.
   */
  public readonly id: string;

  /**
   * The non-unique reference for the route,
   * or undefined no reference has been assigned.
   */
  public readonly reference?: string;

  /**
   * The status of the route.
   */
  public readonly status: RouteStatus;

  /**
   * The fulfiller responsible for the shipment.
   */
  public fulfiller?: Fulfiller;

  /**
   * The date and time at which the route is planned to start.
   */
  public startDateTime: DateTime;

  /**
   * The address at which the route is planned to start.
   */
  public startAddress: Address;

  /**
   * The number of stops on the route.
   */
  public stopCount: number;
}
