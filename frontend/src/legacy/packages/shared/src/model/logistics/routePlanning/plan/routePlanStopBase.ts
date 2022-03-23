import { Location } from "shared/src/model/general/location";
import { Consignor } from "shared/src/model/logistics/consignor";
import { DateTimeRange } from "../../../general/dateTimeRange";
import { GUID } from "shared/src/webKit";

/**
 * Represents one stop for a route plan route
 */
export class RoutePlanStopBase {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any, stopNumber: number, consignors: Consignor[]) {
    this.id = data.id ?? GUID.generate();
    this.stopNumber = stopNumber;
    this.location = new Location(data.location);
    this.arrivalTimeFrame = new DateTimeRange(data.arrivalTimeFrame, {
      setZone: true
    });
    this.weight = data.weight;
    this.volume = data.volume;
  }

  /**
   * The ID for this stop
   */
  public id: string;

  /**
   * The number this stop has on the route.
   */
  public stopNumber: number;

  /**
   * Location of this stop
   */
  public location: Location;

  /**
   * The weight of all colli
   */
  public weight?: number;

  /**
   * The volume of all colli
   */
  public volume?: number;

  /**
   * The range of which the driver is allowed to arrive.
   */
  public arrivalTimeFrame: DateTimeRange;
}
