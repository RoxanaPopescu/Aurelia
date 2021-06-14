import { DateTime } from "luxon";
import { SearchModel } from "app/model/search-model";
import { Position } from "app/model/shared";
import { Driver } from "app/model/driver";
import { Vehicle } from "app/model/vehicle";
import { DriverRouteStop } from "./driver-route-stop";
import { DriverRouteStatus } from "./driver-route-status";
import { RouteCriticality } from "app/model/route";

/**
 * Represents the route a driver should complete within the working day.
 */
export class DriverRoute
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.status = new DriverRouteStatus(data.status);
        this.driverOnline = data.driverOnline;
        this.routeId = data.routeId;
        this.slug = data.slug;
        this.legacyId = data.legacyId;
        this.criticality = new RouteCriticality(data.criticality ?? "low");

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

        if (data.completionTime != null)
        {
            this.completionTime = DateTime.fromISO(data.completionTime, { setZone: true });
        }

        this.stops = data.stops
            .map((s, i: number) => new DriverRouteStop(s, i + 1));

        // The driver is available if all but the last stop is either "completed", "failed" or "cancelled"
        let available = true;
        for (let i = 0; i <= this.stops.length - 2; i++)
        {
            const stop = this.stops[i];

            if (!["completed", "failed", "canceled"].includes(stop.status.slug))
            {
                available = false;
            }
        }

        this.available = available;
    }

    /**
     * The status of the route.
     */
    public readonly status: DriverRouteStatus;

    /**
     * The driver assigned to the route.
     */
    public driver: Driver;

    /**
     * The criticality of the route.
     */
    public readonly criticality: RouteCriticality;

    /**
     * The routeId of the route.
     */
    public routeId: string;

    /**
     * The slug identifying the route.
     */
    public readonly slug: string;

    /**
     * The NOI legacy id
     */
    public readonly legacyId: string;

    /**
     * The vehicle assiged to the route.
     */
    public readonly vehicle?: Vehicle;

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
     * The date and time at which the driver completed, or is estimated to complete,
     * the last stop on the route, or undefined if the route is not yet started.
     */
    public readonly completionTime?: DateTime;

    /**
     * The stops at which the driver must either pick up or deliver colli.
     */
    public readonly stops: DriverRouteStop[];

    /**
     * True if the route has been selected by the user, otherwise false.
     */
    public selected: boolean;

    /**
     * True if the driver is available for new routes, otherwise false.
     */
    public available: boolean;

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
     * The total number of remaining stops on the route,
     * excluding stops the user is not allowed to see.
     */
    public get remainingStopCount(): number
    {
        return this.stops
            .filter(s =>
                s.status.slug !== "cancelled" &&
                s.status.slug === "not-visited")
            .length;
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
    public get currentOrNextStop(): DriverRouteStop | undefined
    {
        return this.stops
            .filter(s =>
                s.status.slug !== "cancelled")
            .find(s =>
                s.status.slug === "arrived" || s.status.slug === "not-visited");
    }

    /**
     * The next stop on the route, or undefined
     * if all stops have been visited or cancelled.
     */
     public get nextStop(): DriverRouteStop | undefined
     {
        const lastStop = this.stops.find(s => s.status.slug === "not-visited");

        if (lastStop?.stopNumber === this.stops.length)
        {
            return undefined;
        }

        return lastStop;
     }

    /**
     * The current or next stop on the route, or undefined
     * if all stops have been visited or cancelled.
     */
    public get lastStop(): DriverRouteStop | undefined
    {
        const remainingStops = this.stops
            .filter(s =>
                s.status.slug !== "cancelled");

        return remainingStops[remainingStops.length - 1];
    }

    /**
     * The future stops at which delays are expected.
     */
    public get expectedDelays(): DriverRouteStop[]
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
    public migrateState(targetRoute?: DriverRoute): void
    {
        if (targetRoute == null)
        {
            return;
        }

        // Migrate the selection state of the route.
        targetRoute.selected = this.selected;

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
