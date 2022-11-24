import { DateTime, Duration } from "luxon";
import { DateTimeRange } from "shared/types";
import { Location } from "app/model/shared";
import { Outfit } from "app/model/outfit";
import { RouteStopStatus } from "./route-stop-status";
import { RouteStopInfo } from "./route-stop-info";
import { RouteEstimates } from "./route-estimates";
import { IRouteReference } from "./route-reference";
import { Pickup } from "./pickup";
import { Delivery } from "./delivery";
import { RouteStopAuthorityToLeave } from "./route-stop-authority-to-leave";

/**
 * Represents a single location, where a driver must either pick up or deliver colli.
 */
export abstract class RouteStopBase extends RouteStopInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any, stopNumber?: number, route?: IRouteReference)
    {
        super(data, stopNumber, route);

        if (data != null)
        {
            this.pickups = data.pickups?.map(p => new Pickup(p)) ?? [];
            this.deliveries = data.deliveries?.map(d => new Delivery(d)) ?? [];

            this.port = data.port;
            this.driverInstructions = data.driverInstructions;
            this.estimatedColliCount = data.estimatedColliCount;

            this.arrivalTimeFrame = new DateTimeRange(data.arrivalTimeFrame, { setZone: true });

            if (data.outfit != null)
            {
                this.outfit = new Outfit(data.outfit);
            }

            if (data.estimates != null)
            {
                this.estimates = new RouteEstimates(data.estimates);
            }

            if (data.initialEstimates != null)
            {
                this.initialEstimates = new RouteEstimates(data.initialEstimates);
            }
            else
            {
                this.initialEstimates = new RouteEstimates();
            }

            if (data.arrivedTime != null)
            {
                this.arrivedTime = DateTime.fromISO(data.arrivedTime, { setZone: true });
            }

            if (data.completedTime != null)
            {
                this.completedTime = DateTime.fromISO(data.completedTime, { setZone: true });
            }

            if (data.taskTimeStarted != null)
            {
                this.taskTimeStarted = DateTime.fromISO(data.taskTimeStarted, { setZone: true });
            }

            if (data.serviceTaskStarted != null)
            {
                this.serviceTaskStarted = DateTime.fromISO(data.serviceTaskStarted, { setZone: true });
            }

            if (data.taskTime != null)
            {
                this.taskTime = Duration.fromObject({ seconds: data.taskTime });
            }

            if (data.authorityToLeave != null)
            {
                this.authorityToLeave = new RouteStopAuthorityToLeave(data.authorityToLeave);
            }

            if (data.waitingTime)
            {
                this.waitingTime = Duration.fromObject({ seconds: data.waitingTime });
            }
        }
        else
        {
            this.pickups = [];
            this.deliveries = [];
        }
    }

    /**
     * The status of this route stop.
     */
    public status: RouteStopStatus;

    /**
     * The pickups to be completed at this stop.
     */
    public readonly pickups: Pickup[];

    /**
     * The deliveries to be completed at this stop.
     */
    public readonly deliveries: Delivery[];

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
     * The estimate colli count for this stop.
     */
    public estimatedColliCount?: number;

    /**
     * The initial estimates for this stop.
     */
    public initialEstimates: RouteEstimates;

    /**
     * The estimates for this stop.
     */
    public authorityToLeave?: RouteStopAuthorityToLeave;

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
    public arrivalTimeFrame: DateTimeRange;

    /**
     * The date and time at which the driver arrived.
     */
    public arrivedTime?: DateTime;

    /**
     * The date and time at which the driver started the task.
     */
    public taskTimeStarted?: DateTime;

    /**
     * The date and time at which the service task started.
     */
    public serviceTaskStarted?: DateTime;

    /**
     * The date and time at which the stop was complated.
     */
    public completedTime?: DateTime;

    /**
     * True if the route stop has been selected by the user, otherwise false.
     */
    public selected = false;

    /**
     * If the driver is currently delayed for this stop
     * This can be unknown if no estimates exist
     */
    public get isDelayed(): boolean | undefined
    {
        if (this.estimates == null)
        {
            return undefined;
        }

        if (this.arrivalTimeFrame == null || this.arrivalTimeFrame.to == null)
        {
            return false;
        }

        return this.estimates.arrivalTime > this.arrivalTimeFrame.to;
    }

    /**
     * The delay at the stop, if the driver arrived late.
     * If the stop is not yet completed, this will be an estimate.
     * Note that the value is rounded down to the nearest minute.
     */
    public get arrivalDelay(): Duration | undefined
    {
        if (!this.isDelayed || this.estimates == null)
        {
            return undefined;
        }

        return this.arrivalTimeFrame.to
            ? this.estimates.arrivalTime
                .startOf("minute")
                .diff(this.arrivalTimeFrame.to.startOf("minute"))
            : undefined;
    }

    /**
     * The time the driver is expected too early
     */
    public get expectedTooEarly(): Duration | undefined
    {
        if (this.estimates == null)
        {
            return undefined;
        }

        return this.arrivalTimeFrame.from
            ? this.arrivalTimeFrame.from
                .startOf("minute")
                .diff(this.estimates.arrivalTime.startOf("minute"))
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
