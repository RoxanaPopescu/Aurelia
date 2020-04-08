import { Duration } from "luxon";
import { DateTimeRange } from "shared/src/model/general/dateTimeRange";

/**
 * Represents metadata for a route plan or a single route plan route
 */
export class RoutePlanMeta {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    this.orderCount = data.orderCount;
    this.colliCount = data.colliCount;
    this.stopsCount = data.stopsCount;
    this.drivingTime = Duration.fromObject({ seconds: data.drivingTime });
    this.loadingTime = Duration.fromObject({ seconds: data.loadingTime });
    this.waitingTime = Duration.fromObject({ seconds: data.waitingTime });
    this.timeFrame = new DateTimeRange(data.timeFrame, { setZone: true });
  }

  /**
   * Amount of orders
   */
  public orderCount: number;

  /**
   * Amount of colli either picked up or delivered
   */
  public colliCount: number;

  /**
   * Amount of stops
   */
  public stopsCount: number;

  /**
   * The estimated driving time the driver has to use to complete
   */
  public drivingTime: Duration;

  /**
   * The estimated loading time the driver will use to load/deliver colli
   */
  public loadingTime: Duration;

  /**
   * The time the driver has to wait.
   * Usually this happens in when the driver is not allowed to deliver befor an allowed timeslot.
   */
  public waitingTime: Duration;

  /**
   * The earliest time for when the driver will begin working
   */
  public timeFrame: DateTimeRange;

  /**
   * The total amount of time
   */
  public get totalTime(): Duration {
    return this.drivingTime.plus(this.loadingTime).plus(this.waitingTime);
  }
}