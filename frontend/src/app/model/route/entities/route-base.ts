import { DateTime } from "luxon";
import { DateTimeRange } from "shared/types";
import { Position } from "app/model/shared";
import { Fulfiller } from "app/model/outfit";
import { Driver } from "app/model/driver";
import { Vehicle, VehicleType } from "app/model/vehicle";
import { SearchModel } from "app/model/search-model";
import { ProductType } from "app/model/product";
import { IRouteReference } from "./route-reference";
import { RouteStatus } from "./route-status";
import { RouteStopBase } from "./route-stop-base";
import { RouteStopInfo } from "./route-stop-info";
import { RouteCriticality } from "./route-criticality";
import { RouteEstimates } from "./route-estimates";

/**
 * Represents a route.
 */
export abstract class RouteBase<TRouteStop extends RouteStopBase = RouteStopBase> implements IRouteReference
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any, stops: (TRouteStop | RouteStopInfo)[])
    {
        this.id = data.id;
        this.slug = data.slug;
        // Remove default solution when we have completed v4 route list
        this.productType = new ProductType(data.productType ?? "solution");
        this.reference = data.reference;
        // Remove default low when we have completed v4 route list
        this.criticality = new RouteCriticality(data.criticality ?? "low");
        this.status = new RouteStatus(data.status);
        this.fulfiller = new Fulfiller(data.fulfiller);
        this.driverOnline = data.driverOnline;
        this.stops = stops;
        this.vehicleType = VehicleType.get(data.vehicleTypeId);
        this.isPrimaryFulfiller = data.isPrimaryFulfiller;
        this.legacyId = data.legacyId;
        this.tags = data.tags ?? [];

        if (data.expires != null)
        {
            this.expires = DateTime.fromISO(data.expires, { setZone: true });
        }

        if (data.driver != null)
        {
            this.driver = new Driver(data.driver);
        }

        if (data.vehicle != null)
        {
            this.vehicle = new Vehicle(data.vehicle);
        }

        if (data.driverPosition != null)
        {
            this.driverPosition = new Position(data.driverPosition);
        }

        if (data.plannedTimeFrame != null)
        {
            this.plannedTimeFrame = new DateTimeRange(data.plannedTimeFrame, { setZone: true });
        }

        if (data.completedTime != null)
        {
            this.completedTime = DateTime.fromISO(data.completedTime, { setZone: true });
        }

        if (data.estimates != null) {
            this.estimates = new RouteEstimates(data.estimates);
        }
    }

    /**
     * The ID of the route.
     */
    public readonly id: string;

    /**
     * The slug identifying the route.
     */
    public readonly slug: string;

    /**
     * The NOI legacy id
     */
    public readonly legacyId: string;

    /**
     * The type of product associated with the route.
     */
    public readonly productType: ProductType;

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
     * The tags associated with the route.
     */
    public readonly tags: string[];

    /**
     * The status of the route.
     */
    public status: RouteStatus;

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
     * The fulfiller responsible for the shipment.
     */
    public fulfiller: Fulfiller;

    /**
     * If the fulfiller is the primary one.
     */
    public isPrimaryFulfiller: boolean;

    /**
     * The driver assigned to the route,
     * or undefined if none has been assigned, or if the
     * user does not have permission to see the driver.
     */
    public driver?: Driver;

    /**
     * The vehicle assiged to the route,
     * or undefined if none has been assigned.
     */
    public vehicle?: Vehicle;

    /**
     * True if the driver is currently online, false if not,
     * or undefined if the route is not yet started.
     */
    public readonly driverOnline?: boolean;

    /**
     * The current position of the driver,
     * or undefined if the route is not yet started.
     */
    public readonly driverPosition?: Position;

    /**
     * The planned timeframe for the route, from arrival at the first stop, to
     * completion of the last, or undefined if the planned time frame is not yet known.
     */
    public readonly plannedTimeFrame?: DateTimeRange;

    /**
     * The estimates for this route.
     */
    public estimates?: RouteEstimates;

    /**
     * The date and time at which the driver completed, or is estimated to complete,
     */
    public readonly completedTime?: DateTime;

    /**
     * The stops at which the driver must either pick up or deliver colli.
     */
    public readonly stops: (TRouteStop | RouteStopInfo)[];

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
                s instanceof RouteStopBase &&
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
                s instanceof RouteStopBase &&
                s.status.slug !== "cancelled" &&
                s.status.slug !== "not-visited")
            .length;
    }

    /**
     * The total number of cancelled stops on the route,
     * excluding stops the user is not allowed to see.
     */
    public get cancelledStopCount(): number
    {
        return this.stops
            .filter(s =>
                s instanceof RouteStopBase)
            .length - this.totalStopCount;
    }

    /**
     * The current or next stop on the route, or undefined
     * if all stops have been visited or cancelled.
     */
    public get currentOrNextStop(): TRouteStop | undefined
    {
        return this.stops
            .filter(s =>
                s instanceof RouteStopBase &&
                s.status.slug !== "cancelled")
            .find(s =>
                s.status.slug === "arrived" || s.status.slug === "not-visited") as TRouteStop;
    }

    /**
     * The future stops at which too early is expected.
     */
    public get expectedTooEarly(): TRouteStop[] {
        return this.stops.filter(
        s =>
            s instanceof RouteStopBase && s.status.slug === "not-visited" && s.expectedTooEarly != null
        ) as TRouteStop[];
    }

    /**
     * The future stops at which delays are expected.
     */
    public get expectedDelays(): TRouteStop[]
    {
        return this.stops
            .filter(s =>
                s instanceof RouteStopBase &&
                s.status.slug === "not-visited" &&
                s.isDelayed) as TRouteStop[];
    }

    /**
     * Migrates the client-side state of this route to the specified route.
     * @param targetRoute The route to which client-side state should be migrated.
     */
    public migrateState(targetRoute: RouteBase): void
    {
        // Migrate the selection state of each of the route stops in this route.
        for (const stop of this.stops)
        {
            if (stop instanceof RouteStopBase)
            {
                const newStop = targetRoute.stops.find(s => s.id === stop.id);
                if (newStop instanceof RouteStopBase)
                {
                    newStop.selected = stop.selected;
                }
            }
        }
    }
}
