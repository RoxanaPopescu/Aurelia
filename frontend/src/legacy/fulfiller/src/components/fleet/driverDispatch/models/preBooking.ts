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
    this.consignorId = data.consignorId;
    this.consignorName = data.consignorName;
    this.date = DateTime.fromISO(data.date);
    this.timeFrame = new DateTimeRange(data.timePeriod, {
      setZone: true
    });
    this.startAddress = data.startAddress;
    this.startAddress = data.startAddress;
    this.vehicleType = VehicleType.get(data.vehicleTypeId);
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
   * The ID of the consignor related to this pre-booking
   */
  public consignorId: string;

  /**
   * The name of the consignor related to this pre-booking
   */
  public readonly consignorName: string;

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
  public readonly startAddress: string;

  /**
   * The vehicle type related to this pre-booking
   */
  public readonly vehicleType: VehicleType;

  /**
   * The driver associated to this pre-booking
   */
  public readonly driver: Driver;
}
