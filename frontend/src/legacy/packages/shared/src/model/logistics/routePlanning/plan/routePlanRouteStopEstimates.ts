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
    this.arrivalTime = DateTime.fromISO(data.arrivalTime, { setZone: true });
    this.timeFrame = new DateTimeRange({ from: this.arrivalTime.minus(this.drivingTime).minus(this.waitingTime), to: this.arrivalTime.plus(this.taskTime)}, { setZone: true });
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

  /**
   * The arrival time.
   */
  public arrivalTime: DateTime;
}
