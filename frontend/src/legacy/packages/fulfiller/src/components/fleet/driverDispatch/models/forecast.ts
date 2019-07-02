import { DateTime } from "luxon";
import { DateTimeRange } from "shared/src/model/general/dateTimeRange";
import { VehicleType } from "shared/src/model/session";

/**
 * Represents a single forecast.
 */
export class Forecast {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    this.id = data.id;
    this.slug = data.slug;
    this.fulfilleeId = data.fulfillee.id;
    this.fulfilleeName = data.fulfillee.name;
    this.date = DateTime.fromISO(data.date);
    this.timeFrame = new DateTimeRange(data.timePeriod, {
      setZone: true
    });
    this.startingAddress = data.startingAddress;
    this.vehicleType = VehicleType.get(data.vehicleTypeId);
    this.slots = {
      total: data.slots.total,
      assigned: data.slots.assigned ? data.slots.assigned : 0
    };
  }

  /**
   * The ID of the forecast
   */
  public readonly id: string;

  /**
   * The slug identifying the forecast
   */
  public slug: string;

  /**
   * The ID of the fulfillee related to this forecast
   */
  public fulfilleeId: string;

  /**
   * The name of the fulfillee related to this forecast
   */
  public readonly fulfilleeName: string;

  /**
   * The status of the collo.
   */
  public readonly date: DateTime;

  /**
   * The time frame related to this forecast
   */
  public readonly timeFrame: DateTimeRange;

  /**
   * The address for this forecast's starting position
   */
  public readonly startingAddress: string;

  /**
   * The vehicle type related to this forecast
   */
  public readonly vehicleType: VehicleType;

  /**
   * The forecast slot availability of this forecast
   */
  public readonly slots: { total: number; assigned: number };
}
