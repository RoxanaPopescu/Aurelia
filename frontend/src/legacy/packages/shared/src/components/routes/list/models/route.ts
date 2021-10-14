import { DateTime } from "luxon";
import { RouteStatus } from "shared/src/model/logistics/routes";
import { Fulfiller } from "shared/src/model/logistics/fulfiller";
import { Address } from "shared/src/model/general/address";
import { Driver } from "shared/src/model/logistics/driver";
import { Consignor } from "app/model/outfit/entities/consignor";
import { VehicleType } from "app/model/vehicle";

export class Route {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    this.id = data.id;
    this.slug = data.slug;
    this.complexity = data.complexity;
    this.reference = data.reference;
    this.status = new RouteStatus(data.status);
    if (data.consignors) {
      this.consignors = data.consignors.map(c => new Consignor(c));
    } else {
      this.consignors = [];
    }

    this.fulfiller =
      data.fulfiller != null ? new Fulfiller(data.fulfiller) : undefined;
    this.startDateTime = DateTime.fromISO(data.startDate, {
      setZone: true
    }).setZone("local", { keepLocalTime: true });
    this.endDateTime = DateTime.fromISO(data.endDate, {
      setZone: true
    }).setZone("local", { keepLocalTime: true });
    this.startAddress = new Address({ primary: data.startAddress });
    this.endAddress = new Address({ primary: data.endAddress });
    this.stopCount = data.stopCount;
    this.vehicleType = VehicleType.get(data.vehicleTypeId);
    if (data.driver) {
      this.driver = new Driver(data.driver);
    }
  }

  /**
   * The unique slug of the route.
   */
  public readonly slug: string;

  /**
   * The unique ID of the route.
   */
  public readonly id: string;

  /**
   * The complexity of the route.
   */
  public readonly complexity: number;

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
   * The consignors linked to the route.
   */
  public consignors: Consignor[];

  /**
   * The date and time at which the route is planned to start.
   */
  public startDateTime: DateTime;

  /**
   * The date and time at which the route is planned to end.
   */
  public endDateTime: DateTime;

  /**
   * The address at which the route is planned to start.
   */
  public startAddress: Address;

  /**
   * The address at which the route is planned to end.
   */
  public endAddress: Address;

  /**
   * The number of stops on the route.
   */
  public stopCount: number;

  /**
   * The driver assigned to the route.
   */
  public driver?: Driver;

  /**
   * The type of vehicle required for the route.
   */
  public readonly vehicleType: VehicleType;

  /**
   * Formats the consignor names on a single line.
   */
  public get consignorNames(): string {
    return this.consignors ?
            this.consignors.filter(c => c.companyName !== "unknown" && c.companyName !== undefined).map(c => c.companyName).join(", ") :
            "--";
  }
}
