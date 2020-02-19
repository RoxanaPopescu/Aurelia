import { DateTime, Duration } from "luxon";
import { DateTimeRange } from "shared/types";
import { Location } from "app/model/shared";
import { Outfit } from "app/model/outfit";
import { RouteStopStatus } from "./route-stop-status";
import { RouteStopInfo } from "./route-stop-info";
import { RouteEstimates } from "./route-estimates";

/**
 * Represents a single location, where a driver must either pick up or deliver colli.
 */
export abstract class RouteStopBase extends RouteStopInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any, stopNumber?: number)
    {
        super(data, stopNumber);

        if (data != null)
        {
            this.port = data.port;
            this.driverInstructions = data.driverInstructions;

            this.arrivalTimeFrame = new DateTimeRange(data.arrivalTimeFrame, { setZone: true });
            this.isDelayed = data.isDelayed;

            if (data.outfit != null)
            {
                this.outfit = new Outfit(data.outfit);
            }

            if (data.estimates != null)
            {
                this.estimates = new RouteEstimates(data.estimates);
            }

            if (data.arrivalTime != null)
            {
                this.arrivalTime = DateTime.fromISO(data.arrivalTime, { setZone: true });
            }

            if (data.completionTime != null)
            {
                this.completionTime = DateTime.fromISO(data.completionTime, { setZone: true });
            }

            if (data.taskTime != null)
            {
                this.taskTime = Duration.fromObject({ seconds: data.taskTime });
            }

            if (data.waitingTime) {
                this.waitingTime = Duration.fromObject({ seconds: data.waitingTime });
            }
        }
    }

    /**
     * The status of this route stop.
     */
    public status: RouteStopStatus;

    /**
     * The consignee/consignor at this stop.
     */
    public readonly outfit?: Outfit;

    /**
     * The address identifying the location of the stop.
     */
    public location: Location;

    /**
     * The estimates for this stop.
     */
    public estimates?: RouteEstimates;

    /**
     * The port to use at this stop.
     */
    public readonly port?: string;

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
     * The date and time at which the driver arrived.
     */
    public arrivalTime?: DateTime;

    /**
     * The date and time at which the stop was complated.
     */
    public completionTime?: DateTime;

    /**
     * True if there is a delay at this stop, and the delay excedes
     * the threshold for an acceptable delay, or undefined if the route
     * is not yet started.
     */
    public isDelayed?: boolean;

    /**
     * True if the route stop has been selected by the user, otherwise false.
     */
    public selected = false;

    /**
     * The delay at the stop, if the driver arrived late.
     * If the stop is not yet completed, this will be an estimate.
     * Note that the value is rounded down to the nearest minute.
     */
    public get arrivalDelay(): Duration | undefined
    {
        return this.isDelayed && this.arrivalTime && this.arrivalTimeFrame.to
            ? this.arrivalTime
                .startOf("minute")
                .diff(this.arrivalTimeFrame.to.startOf("minute"))
            : undefined;
    }

    /**
     * True if there is an alert for this route stop, otherwise false.
     * @returns True if there is an alert for this route stop, otherwise false.
     */
    protected getHasAlert(): boolean
    {
        return (
            ((this.status.slug === "arrived" || this.status.slug === "completed") && this.isDelayed) ||
            this.status.accent === "negative"
        );
    }

    /**
     * True if there is an alert for this route stop, otherwise false.
     * @returns True if there is an alert for this route stop, otherwise false.
     */
    protected getHasWarning(): boolean
    {
        return this.status.slug === "not-visited" && this.isDelayed === true;
    }

    /**
     * True if there is an alert for this route stop, otherwise false.
     */
    public get hasAlert(): boolean
    {
        return this.getHasAlert();
    }

    /**
     * True if there is a warning for this route stop, otherwise false.
     */
    public get hasWarning(): boolean
    {
        return this.getHasWarning();
    }
}
