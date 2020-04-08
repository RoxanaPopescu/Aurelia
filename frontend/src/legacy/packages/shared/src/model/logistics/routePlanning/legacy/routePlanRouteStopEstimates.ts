import { Duration, DateTime } from "luxon";
import { DateTimeRange } from "shared/src/model/general/dateTimeRange";

/**
 * Represents metadata for a route plan or route plan route
 */
export class LegacyRoutePlanRouteStopEstimates {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    this.drivingTime = Duration.fromObject({ seconds: data.drivingTime });
    this.loadingTime = Duration.fromObject({ seconds: data.loadingTime });
    this.waitingTime = Duration.fromObject({ seconds: data.waitingTime });
    this.timeFrame = new DateTimeRange(data.timeFrame, { setZone: true });
  }

  /**
   * The estimated driving time.
   */
  public drivingTime: Duration;

  /**
   * The estimated loading time.
   */
  public loadingTime: Duration;

  /**
   * The estimated waiting time.
   */
  public waitingTime: Duration;

  /**
   * The estimated time for starting.
   */
  public timeFrame: DateTimeRange;

  public get arrival(): DateTime {
    return this.timeFrame.from!.plus(this.waitingTime).plus(this.drivingTime);
  }
}
