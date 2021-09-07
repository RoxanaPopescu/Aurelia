import { Signature, Photo } from "app/model/shared";
import { RouteStopBase } from "./route-stop-base";
import { Pickup } from "./pickup";
import { Delivery } from "./delivery";
import { RouteStopDeviation } from "./route-stop-deviation";
import { RouteStopActions } from "./route-stop-actions";
import clone from "clone";
import { Duration } from "luxon";
import { RouteStopIdentity } from "./route-stop-identity";
import { ColloScanMethod, ColloStatus } from "app/model/collo";

/**
 * Represents a single location, where a driver must either pick up or deliver colli.
 */
export class RouteStop extends RouteStopBase
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any, stopNumber?: number)
    {
        if (data != null)
        {
            super(data, stopNumber);

            this.pickups = data.pickups.map(p => new Pickup(p));
            this.deliveries = data.deliveries.map(d => new Delivery(d));
            this.actions = new RouteStopActions(data.actions);
            this.deviations = data.deviations.map(p => new RouteStopDeviation(p));
            this.selfies = data.selfies.map(p => new Photo(p));
            this.tags = data.tags;
            this.collectionPointId = data.collectionPointId;

            if (data.orderIds)
            {
                this.orderIds = data.orderIds;
            }
            else
            {
                this.orderIds = [];
            }

            if (data.identity != null)
            {
                this.identity = new RouteStopIdentity(data.identity);
            }

            if (data.signature != null)
            {
                this.signature = new Signature(data.signature);
            }

            if (data.photo != null)
            {
                this.photo = new Photo(data.photo);
            }
        }
        else
        {
            super(undefined, stopNumber);

            this.pickups = [];
            this.deliveries = [];
            this.orderIds = [];
            this.actions = new RouteStopActions();
        }
    }

    /**
     * The pickups to be completed at this stop.
     */
    public readonly pickups: Pickup[];

    /**
     * The deliveries to be completed at this stop.
     */
    public readonly deliveries: Delivery[];

    /**
     * The actions that are required to complete the stop.
     */
    public readonly actions: RouteStopActions;

    /**
     * The deviations associated with the stop.
     */
    public readonly deviations: RouteStopDeviation[];

    /**
     * The selfies captured at the stop to verify the drivers identity and appearance.
     */
    public readonly selfies: Photo[];

    /**
     * The identity captured to prove that the stop was completed.
     */
     public readonly identity?: RouteStopIdentity;

    /**
     * The signature captured to prove that the stop was completed.
     */
    public readonly signature?: Signature;

    /**
     * The collection point id related to this stop
     */
    public readonly collectionPointId?: string;

    /**
     * The photo captured to prove that the deliveries were completed.
     */
    public readonly photo?: Photo;

    /**
     * The tags associated with the stop.
     */
    public readonly tags: string[];

    /**
     * The order ids associated with the stop.
     */
    public readonly orderIds: string[];

    /**
     * The status of all the collo.
     */
    public allColliStatus: ColloStatus | undefined;

     /**
      * The status scan method of all the collo.
      */
    public allColliScanMethod: ColloScanMethod | undefined;

    /**
     * True if there is an alert for this route stop, otherwise false.
     */
    public get hasAlert(): boolean
    {
        return (this.getHasAlert() || this.deviations.length > 0 || this.hasColliProblem);
    }

    /**
     * True if there is an alert for this route stop, otherwise false.
     */
    public get hasColliProblem(): boolean
    {
        return (
            this.pickups.some(p => p.colli.some(c => c.status.accent.pickup === "negative")) ||
            this.deliveries.some(d => d.colli.some(c => c.status.accent.delivery === "negative"))
        );
    }

    /**
     * The total number colli associated with this stop.
     */
    public get totalColliCount(): number
    {
        return this.pickups
            .reduce((t, d) => t + d.colli.length, 0) + this.deliveries.reduce((t, d) => t + d.colli.length, 0);
    }

    /**
     * The total number colli that has been picked up or delivered at this stop.
     */
    public get scannedColliCount(): number
    {
        return [...this.pickups, ...this.deliveries]
            .reduce((t, d) => t + d.colli.filter(c => c.status.slug === "picked-up" || c.status.slug === "delivered").length, 0);
    }

    /**
     * The delay at the stop, if the driver arrived late.
     */
    public get arrivedDelay(): Duration | undefined
    {
        if (this.arrivedTime == null || this.arrivalTimeFrame?.to == null)
        {
            return undefined;
        }

        const duration = this.arrivedTime.diff(this.arrivalTimeFrame.to);

        return duration.valueOf() > 0 ? duration : undefined;
    }

    /**
     * The delay at the stop, if the driver is extimated to arrive late.
     */
    public get expectedArrivalDelay(): Duration | undefined
    {
        if (this.arrivedTime != null)
        {
            return undefined;
        }

        if (this.estimates == null || this.arrivalTimeFrame == null || this.arrivalTimeFrame.to == null)
        {
            return undefined;
        }

        const duration = this.estimates.arrivalTime.diff(this.arrivalTimeFrame.to);

        return duration.valueOf() > 0 ? duration : undefined;
    }

    /**
     * The too early arrival at the stop, if the driver arrived too early.
     * Note that the value is rounded up to the nearest minute.
     */
    public get arrivedTooEarly(): Duration | undefined
    {
        if (this.arrivedTime == null || this.arrivalTimeFrame?.from == null)
        {
            return undefined;
        }

        const duration = this.arrivalTimeFrame.from.diff(this.arrivedTime);

        return duration.valueOf() > 0 ? duration : undefined;
    }

    /**
     * The time the driver is expected too early
     */
    public get expectedTooEarly(): Duration | undefined
    {
        if (this.arrivedTime != null)
        {
            return undefined;
        }

        if (this.estimates == null || this.arrivalTimeFrame?.from == null)
        {
            return undefined;
        }

        const duration = this.arrivalTimeFrame.from.diff(this.estimates.arrivalTime);

        return duration.valueOf() > 0 ? duration : undefined;
    }

    /**
     * Gets a clone of this instance, suitable for editing.
     */
    public clone(): any
    {
        return clone(this);
    }

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            id: this.id,
            reference: this.reference,
            location: this.location,
            status: this.status.slug,
            type: this.type.slug,
            arrivalTimeFrame: this.arrivalTimeFrame,
            outfit: this.outfit,
            port: this.port,
            driverInstructions: this.driverInstructions,
            actions: this.actions,
            arrivedTime: this.arrivedTime,
            completedTime: this.completedTime,
            tags: this.tags,
            breakTime: this.breakTime?.as("seconds"),
            allColliStatus: this.allColliStatus?.slug,
            allColliScanMethod: this.allColliScanMethod?.slug
        };
    }
}
