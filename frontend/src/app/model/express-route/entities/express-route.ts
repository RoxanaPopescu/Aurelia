import { DateTime, Duration } from "luxon";
import { SearchModel } from "app/model/search-model";
import { Location, WeightRange } from "app/model/shared";
import { Outfit } from "app/model/outfit";
import { VehicleType } from "app/model/vehicle";
import { IRouteReference, RouteCriticality } from "app/model/route";
import { ExpressRouteStop } from "./express-route-stop";
import { computedFrom } from "aurelia-binding";

// The available color indexes.
const colorIndexes = [1, 2, 3, 4, 5, 6, 7, 8];

/**
 * Represents an express route that should be dispatched to a driver.
 */
export class ExpressRoute implements IRouteReference
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.slug = data.slug;
        this.reference = data.reference;
        this.criticality = new RouteCriticality(data.criticality);
        this.pickupPostalCode = data.pickupPostalCode;
        this.deliveryPostalCode = data.deliveryPostalCode;
        this.timeToDeadline = Duration.fromObject({ seconds: data.timeToDeadline });

        this.vehicleType = VehicleType.get(data.vehicleTypeId);

        if (data.totalWeightRange != null)
        {
            this.totalWeightRange = new WeightRange(data.totalWeightRange);
        }

        if (data.expires != null)
        {
            this.expires = DateTime.fromISO(data.expires, { setZone: true });
        }

        this.stops = data.stops
            .map((s, i: number) => new ExpressRouteStop(s, this, i + 1, i === 0 ? this.criticality : undefined));
    }

    private _selected: boolean;

    /**
     * The ID of the route.
     */
    public readonly id: string;

    /**
     * The slug identifying the route.
     */
    public readonly slug: string;

    /**
     * The non-unique reference for the route,
     * or undefined if no reference has been assigned.
     */
    public readonly reference?: string;

    /**
     * The criticality of the route.
     */
    public readonly criticality: RouteCriticality;

    /**
     * The date and time at which the request for this route expires,
     * and can no longer be accepted, or undefined if this route did
     * not originate as a request.
     */
    public readonly expires?: DateTime;

    /**
     * The type of vehicle required for the route.
     */
    public readonly vehicleType: VehicleType;

    /**
     * The total weight range for the colli in the order.
     */
    public readonly totalWeightRange?: WeightRange;

    /**
     * The stops at which the driver must either pick up or deliver colli.
     */
    public readonly stops: ExpressRouteStop[];

    /**
     * The postal code in which the pickup stop is located.
     */
    public readonly pickupPostalCode: number;

    /**
     * The postal code in which the delivery stop is located.
     */
    public readonly deliveryPostalCode: number;

    /**
     * The time remaining before the end of the pickup timeframe.
     */
    public readonly timeToDeadline: Duration;

    /**
     * The index of the color to use when presenting this route.
     */
    public colorIndex: number | undefined;

    /**
     * True if the route has been selected by the user, otherwise false.
     */
    @computedFrom("_selected")
    public get selected(): boolean
    {
        return this._selected;
    }
    public set selected(value: boolean)
    {
        if (value !== this._selected)
        {
            if (value)
            {
                this.colorIndex = (colorIndexes.shift() as any || 0);
            }
            else if (this.colorIndex)
            {
                colorIndexes.unshift(this.colorIndex);
                this.colorIndex = undefined;
            }

            this._selected = value;
        }
    }

    /**
     * The consignor associated with the pickup stop on the route,
     * or undefined if this information is not visible to the current user.
     */
    public get consignor(): Outfit | undefined
    {
        const pickupStop = this.stops[0];

        return pickupStop.outfit;
    }

    /**
     * The consignor associated with the delivery stop on the route,
     * or undefined if this information is not visible to the current user.
     */
    public get consignee(): Outfit | undefined
    {
        const deliveryStop = this.stops[this.stops.length - 1];

        return deliveryStop.outfit;
    }

    /**
     * The earliest date and time the driver is allowed to arrive at the pickup stop
     */
    public get earliestPickupDate(): DateTime | undefined
    {
        const pickupStop = this.stops[0];

        return pickupStop.arrivalTimeFrame.from;
    }

    /**
     * The latest date and time the driver is allowed to arrive at the pickup stop
     */
    public get latestPickupDate(): DateTime | undefined
    {
        const pickupStop = this.stops[0];

        return pickupStop.arrivalTimeFrame.to;
    }

    /**
     * The earliest date and time the driver is allowed to arrive at the delivery stop
     */
    public get earliestDeliveryDate(): DateTime | undefined
    {
        const deliveryStop = this.stops[this.stops.length - 1];

        return deliveryStop.arrivalTimeFrame.from;
    }

    /**
     * The latest date and time the driver is allowed to arrive at the delivery stop
     */
    public get latestDeliveryDate(): DateTime | undefined
    {
        const deliveryStop = this.stops[this.stops.length - 1];

        return deliveryStop.arrivalTimeFrame.to;
    }

    /**
     * The location of the pickup stop.
     */
    public get pickupLocation(): Location
    {
        return this.stops[0].location;
    }

    /**
     * The location of the delivery stop.
     */
    public get deliveryLocation(): Location
    {
        return this.stops[this.stops.length - 1].location;
    }

    /**
     * The model representing the searchable text in the entity.
     */
    public readonly searchModel = new SearchModel(this);

    /**
     * The total number of non-cancelled stops on the route,
     * excluding stops the user is not allowed to see.
     */
    public get totalStopCount(): number
    {
        return this.stops
            .filter(s =>
                s.status.slug !== "cancelled")
            .length;
    }

    /**
     * The total number of visited stops on the route,
     * excluding stops the user is not allowed to see.
     */
    public get visitedStopCount(): number
    {
        return this.stops
            .filter(s =>
                s.status.slug !== "cancelled" &&
                s.status.slug !== "not-visited")
            .length;
    }

    /**
     * The estimated length of the route
     */
     public get estimatedDuration(): Duration | undefined
     {
        if (this.stops[0].estimates == null || this.stops[this.stops.length - 1].estimates == null)
        {
            return undefined;
        }

        return this.stops[this.stops.length - 1].estimates!.completionTime.diff(this.stops[0].estimates!.arrivalTime);
     }

    /**
     * The total number of cancelled stops on the route,
     * excluding stops the user is not allowed to see.
     */
    public get cancelledStopCount(): number
    {
        return this.stops.length - this.totalStopCount;
    }

    /**
     * The current or next stop on the route, or undefined
     * if all stops have been visited or cancelled.
     */
    public get currentOrNextStop(): ExpressRouteStop | undefined
    {
        return this.stops
            .filter(s =>
                s.status.slug !== "cancelled")
            .find(s =>
                s.status.slug === "arrived" || s.status.slug === "not-visited");
    }

    /**
     * The future stops at which delays are expected.
     */
    public get expectedDelays(): ExpressRouteStop[]
    {
        return this.stops
            .filter(s =>
                s.status.slug === "not-visited" &&
                s.isDelayed);
    }

    /**
     * Migrates the client-side state of this route to the specified route.
     * @param targetRoute The route to which client-side state should be migrated.
     */
    public migrateState(targetRoute?: ExpressRoute): void
    {
        if (targetRoute == null)
        {
            return;
        }

        // Migrate the selection and color state of the route.
        targetRoute._selected = this._selected;
        targetRoute.colorIndex = this.colorIndex;

        // Migrate the selection state of each of the route stops in this route.
        for (const stop of this.stops)
        {
            const newStop = targetRoute.stops.find(s => s.id === stop.id);

            if (newStop != null)
            {
                newStop.selected = stop.selected;
            }
        }
    }
}
