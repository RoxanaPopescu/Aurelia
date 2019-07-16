import { DateTime } from "luxon";
import { SearchModel } from "app/model/search-model";
import { Position } from "app/model/shared";
import { Driver } from "app/model/driver";
import { Vehicle } from "app/model/vehicle";
import { RouteStopInfo } from "app/model/route";
import { DriverRouteStop } from "./driver-route-stop";
import { DriverRouteStatus } from "./driver-route-status";

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

        if (data.driver != null)
        {
            this.driver = new Driver(data.driver);
        }

        if (data.driverVehicle != null)
        {
            this.driverVehicle = new Vehicle(data.driverVehicle);
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
            .map((s, i: number) => s.hidden ? new RouteStopInfo(s, i) : new DriverRouteStop(s, i + 1));
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
     * The vehicle assiged to the route.
     */
    public readonly driverVehicle?: Vehicle;

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
    public readonly stops: (DriverRouteStop | RouteStopInfo)[];

    /**
     * True if the route has been selected by the user, otherwise false.
     */
    public selected: boolean;

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
                s instanceof DriverRouteStop &&
                !s.status.slug.startsWith("cancelled"))
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
                s instanceof DriverRouteStop &&
                !s.status.slug.startsWith("cancelled") &&
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
                s instanceof DriverRouteStop &&
                !s.status.slug.startsWith("cancelled") &&
                s.status.slug === "not-visited")
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
                s instanceof DriverRouteStop)
            .length - this.totalStopCount;
    }

    /**
     * The current or next stop on the route, or undefined
     * if all stops have been visited or cancelled.
     */
    public get currentOrNextStop(): DriverRouteStop | undefined
    {
        return this.stops
            .filter(s =>
                s instanceof DriverRouteStop &&
                !s.status.slug.startsWith("cancelled"))
            .find(s =>
                s.status.slug === "arrived" || s.status.slug === "not-visited") as DriverRouteStop;
    }

    /**
     * The current or next stop on the route, or undefined
     * if all stops have been visited or cancelled.
     */
    public get lastStop(): DriverRouteStop | undefined
    {
        const remainingStops = this.stops
            .filter(s =>
                s instanceof DriverRouteStop &&
                !s.status.slug.startsWith("cancelled"));

        return remainingStops[remainingStops.length - 1]  as DriverRouteStop;
    }

    /**
     * The future stops at which delays are expected.
     */
    public get expectedDelays(): DriverRouteStop[]
    {
        return this.stops
            .filter(s =>
                s instanceof DriverRouteStop &&
                s.status.slug === "not-visited" &&
                s.isDelayed) as DriverRouteStop[];
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
            if (stop instanceof DriverRouteStop)
            {
                const newStop = targetRoute.stops.find(s => s.id === stop.id);
                if (newStop instanceof DriverRouteStop)
                {
                    newStop.selected = stop.selected;
                }
            }
        }
    }
}
