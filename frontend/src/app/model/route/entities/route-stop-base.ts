import { DateTime, Duration } from "luxon";
import { DateTimeRange } from "shared/types";
import { Location } from "app/model/shared";
import { Outfit } from "app/model/outfit";
import { RouteStopStatus } from "./route-stop-status";
import { RouteStopInfo } from "./route-stop-info";

/**
 * Represents a single location, where a driver must either pick up or deliver colli.
 */
export abstract class RouteStopBase extends RouteStopInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any, stopNumber: number)
    {
        super(data, stopNumber);

        this.id = data.id;
        this.stopNumber = stopNumber;
        this.status = new RouteStopStatus(data.status);
        this.location = new Location(data.location);
        this.port = data.port;
        this.driverInstructions = data.driverInstructions;
        this.arrivalTimeFrame = new DateTimeRange(data.arrivalTimeFrame, { setZone: true });
        this.isDelayed = data.isDelayed;

        if (data.outfit != null)
        {
            this.outfit = new Outfit(data.outfit);
        }

        if (data.arrivalTime != null)
        {
            this.arrivalTime = DateTime.fromISO(data.arrivalTime, { setZone: true });
        }

        if (data.loadingTime != null)
        {
            this.loadingTime = Duration.fromObject({ seconds: data.loadingTime });
        }
    }

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
    public readonly loadingTime: Duration;

    /**
     * The timeframe within which the driver must arrive.
     */
    public readonly arrivalTimeFrame: DateTimeRange;

    /**
     * The date and time at which the driver arrives.
     * If the stop is not yet completed, this will be an estimate.
     * If the route is not yet accepted, this will be undefined.
     */
    public arrivalTime?: DateTime;

    /**
     * True if there is a delay at this stop, and the delay excedes
     * the threshold for an acceptable delay, or undefined if the route
     * is not yet started.
     */
    public isDelayed?: boolean;

    /**
     * True if the route stop has been selected by the user, otherwise false.
     */
    public selected: boolean;

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
