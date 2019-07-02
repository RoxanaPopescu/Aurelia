import { DateTime } from "luxon";
import { DateTimeRange } from "shared/src/model/general/dateTimeRange";
import { Driver } from "shared/src/model/logistics/order/driver";
import { VehicleType } from "shared/src/model/session";

/**
 * Represents a single pre-booking.
 */
export class PreBooking {
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
    // TODO: REMOVE WHEN DATA IS OK
    if (!data.driver.name) {
      data.driver.name = { first: "--", last: "--" };
      data.driver.phone = { countryPrefix: "", number: "" };
    }
    this.driver = new Driver(data.driver);
  }

  /**
   * The ID of the pre-booking
   */
  public readonly id: string;

  /**
   * The slug identifying the pre-booking
   */
  public slug: string;

  /**
   * The ID of the fulfillee related to this pre-booking
   */
  public fulfilleeId: string;

  /**
   * The name of the fulfillee related to this pre-booking
   */
  public readonly fulfilleeName: string;

  /**
   * The status of the collo.
   */
  public readonly date: DateTime;

  /**
   * The time period related to this pre-booking
   */
  public readonly timeFrame: DateTimeRange;

  /**
   * The address for this pre-booking's starting position
   */
  public readonly startingAddress: string;

  /**
   * The vehicle type related to this pre-booking
   */
  public readonly vehicleType: VehicleType;

  /**
   * The driver associated to this pre-booking
   */
  public readonly driver: Driver;
}
