import { Duration, DateTime } from "luxon";
import { DateTimeRange } from "shared/src/model/general/dateTimeRange";

/**
 * Represents metadata for a route plan or route plan route
 */
export class RoutePlanRouteStopEstimates {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    this.distance = data.distance;
    this.drivingTime = Duration.fromObject({ seconds: data.drivingTime });
    this.taskTime = Duration.fromObject({ seconds: data.taskTime });
    this.waitingTime = Duration.fromObject({ seconds: data.waitingTime });
    this.timeFrame = new DateTimeRange(data.timeFrame, { setZone: true });
  }

  /**
   * The estimated driving time.
   */
  public drivingTime: Duration;

  /**
   * The estimated task time.
   */
  public taskTime: Duration;

  /**
   * The estimated waiting time.
   */
  public waitingTime: Duration;

  /**
   * The distance in meters.
   */
  public distance: number;

  /**
   * The estimated time for starting.
   */
  public timeFrame: DateTimeRange;

  public get arrival(): DateTime {
    return this.timeFrame.from!.plus(this.waitingTime).plus(this.drivingTime);
  }
}
