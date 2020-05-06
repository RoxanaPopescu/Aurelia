import { DateTime, Duration } from "luxon";
import { DateTimeRange } from "../../general/dateTimeRange";
import { Location } from "../../general/location";
import { Outfit } from "../outfit";
import { RouteStopStatus } from "./routeStopStatus";
import { RouteStopBase } from "./routeStopBase";
import { observable } from "mobx";
import { RouteEstimates } from "./routeEstimates";

/**
 * Represents a single location, where a driver must either pick up or deliver colli.
 */
export abstract class RouteStop extends RouteStopBase {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any, stopNumber: number) {
    super(data, stopNumber);

    this.id = data.id;
    this.stopNumber = stopNumber;
    this.status = new RouteStopStatus(data.status);
    this.location = new Location(data.location);
    this.gate = data.gate;
    this.driverInstructions = data.driverInstructions;
    this.arrivalTimeFrame = new DateTimeRange(data.arrivalTimeFrame, {
      setZone: true
    });
    this.isDelayed = data.isDelayed;

    if (data.outfit != null) {
      this.outfit = new Outfit(data.outfit);
    }

    if (data.arrivedTime != null)
    {
        this.arrivedTime = DateTime.fromISO(data.arrivedTime, { setZone: true });
    }

    if (data.completedTime != null)
    {
        this.completedTime = DateTime.fromISO(data.completedTime, { setZone: true });
    }

    if (data.estimates != null)
    {
        this.estimates = new RouteEstimates(data.estimates);
    }

    if (data.taskTime != null)
    {
        this.taskTime = Duration.fromObject({ seconds: data.taskTime });
    }

    if (data.waitingTime) {
        this.waitingTime = Duration.fromObject({ seconds: data.waitingTime });
    }
  }

  /**
   * The estimates for this stop.
   */
  public estimates?: RouteEstimates;

  /**
   * The ID of the route stop.
   */
  public readonly id: string;

  /**
   * The number this stop has on the route.
   */
  public readonly stopNumber: number;

  /**
   * The status of this route stop.
   */
  public readonly status: RouteStopStatus;

  /**
   * The consignee/consignor at this stop.
   */
  public readonly outfit?: Outfit;

  /**
   * The address identifying the location of the stop.
   */
  public readonly location: Location;

  /**
   * The gate to use at this stop.
   */
  public readonly gate?: string;

  /**
   * The instructions the driver should follow, if any.
   */
  public readonly driverInstructions?: string;

  /**
   * The time spent loading and unloading at the stop.
   * If the stop is not yet completed, this will be an estimate.
   */
  public readonly taskTime?: Duration;

  /**
   * The time the driver waited before he could start the taskTime
   */
  public readonly waitingTime?: Duration;

  /**
   * The timeframe within which the driver must arrive.
   */
  public readonly arrivalTimeFrame: DateTimeRange;

  /**
   * The date and time at which the driver is estimated to arrive.
   * If the stop is not yet completed, this will be an estimate.
   * If the route is not yet accepted, this will be undefined.
   */
  public readonly arrivedTime?: DateTime;
  public readonly completedTime?: DateTime;

  /**
   * True if there is a delay at this stop, and the delay excedes
   * the threshold for an acceptable delay, or undefined if the route
   * is not yet started.
   */
  public readonly isDelayed?: boolean;

  /**
   * True if the route stop has been selected by the user,
   * otherwise false.
   */
  @observable public selected: boolean;

  /**
   * The delay at the stop, if the driver arrived late.
   */
  public get arrivedDelay(): Duration | undefined
  {
      if (this.arrivedTime === null || this.arrivalTimeFrame?.to == null) {
          return undefined;
      }

      let duration = this.arrivedTime!.diff(this.arrivalTimeFrame.to);

      return duration.get("minute") > 0 ? duration : undefined;
  }

  /**
   * The delay at the stop, if the driver is extimated to arrive late.
   */
  public get expectedArrivalDelay(): Duration | undefined
  {
      if (this.arrivedTime !== null) {
        return undefined;
      }

      if (this.estimates == null || this.arrivalTimeFrame?.to == null) {
          return undefined;
      }

      let duration = this.estimates.arrivalTime.diff(this.arrivalTimeFrame.to);

      return duration.get("minute") > 0 ? duration : undefined;
  }

  /**
   * The too early arrival at the stop, if the driver arrived too early.
   * Note that the value is rounded up to the nearest minute.
   */
  public get arrivedTooEarly(): Duration | undefined
  {
      if (this.arrivedTime === null || this.arrivalTimeFrame?.from === null) {
          return undefined;
      }

      let duration = this.arrivalTimeFrame.from!.diff(this.arrivedTime!);
      return duration.get("minute") > 0 ? duration : undefined;
  }

  /**
   * The time the driver is expected too early
   */
  public get expectedTooEarly(): Duration | undefined
  {
      if (this.arrivedTime !== null) {
        return undefined;
      }

      if (this.estimates === null || this.arrivalTimeFrame?.from === null) {
          return undefined;
      }

      let duration = this.arrivalTimeFrame.from!.diff(this.estimates!.arrivalTime);
      return duration.get("minute") > 0 ? duration : undefined;
  }

  /**
   * True if there is an alert for this route stop, otherwise false.
   */
  protected getHasAlert(): boolean {
    return (
      ((this.status.slug === "arrived" || this.status.slug === "completed") &&
        this.isDelayed) ||
      this.status.accent === "negative"
    );
  }

  /**
   * True if there is an alert for this route stop, otherwise false.
   */
  public get hasAlert(): boolean {
    return this.getHasAlert();
  }

  /**
   * True if there is a warning for this route stop, otherwise false.
   */
  public get hasWarning(): boolean {
    return this.status.slug === "not-visited" && this.isDelayed === true;
  }
}
