import { DateTime } from "luxon";
import { DateTimeRange, Position } from "app/model/entities/shared";
import { Fulfiller } from "../outfit/fulfiller";
import { Driver } from "../driver/driver";
import { VehicleType } from "../vehicle/vehicle-type";
import { Vehicle } from "../vehicle/vehicle";
import { IRouteReference } from "./route-reference";
import { RouteStatus } from "./route-status";
import { RouteStop } from "./route-stop";
import { RouteStopBase } from "./route-stop-base";
import { RouteCriticality } from "./route-criticality";

/**
 * Represents a route.
 */
export abstract class Route<TRouteStop extends RouteStop = RouteStop> implements IRouteReference
{
    public constructor(data: any, stops: (TRouteStop | RouteStopBase)[])
    {
        this.id = data.id;
        this.slug = data.slug;
        this.reference = data.reference;
        this.criticality = new RouteCriticality(data.criticality);
        this.status = new RouteStatus(data.status);
        this.fulfiller = new Fulfiller(data.fulfiller);
        this.driverOnline = data.driverOnline;
        this.stops = stops;

        this.vehicleType = VehicleType.get(data.vehicleTypeId);

        if (data.expires != null)
        {
            this.expires = DateTime.fromISO(data.expires, { setZone: true });
        }

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

        if (data.plannedTimeFrame != null)
        {
            this.plannedTimeFrame = new DateTimeRange(data.plannedTimeFrame, { setZone: true });
        }

        if (data.completionTime != null)
        {
            this.completionTime = DateTime.fromISO(data.completionTime, { setZone: true });
        }
    }

    private _json: string | undefined;

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
     * The driver assigned to the route,
     * or undefined if none has been assigned, or if the
     * user does not have permission to see the driver.
     */
    public driver?: Driver;

    /**
     * The vehicle assiged to the route,
     * or undefined if none has been assigned.
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
     * The planned timeframe for the route, from arrival at the first stop, to
     * completion of the last, or undefined if the planned time frame is not yet known.
     */
    public readonly plannedTimeFrame?: DateTimeRange;

    /**
     * The date and time at which the driver completed, or is estimated to complete,
     * the last stop on the route, or undefined if the route is not yet started.
     */
    public readonly completionTime?: DateTime;

    /**
     * The stops at which the driver must either pick up or deliver colli.
     */
    public readonly stops: (RouteStop | RouteStopBase)[];

    /**
     * The total number of non-cancelled stops on the route,
     * excluding stops the user is not allowed to see.
     */
    public get totalStopCount(): number
    {
        return this.stops
            .filter(s =>
                s instanceof RouteStop &&
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
                s instanceof RouteStop &&
                !s.status.slug.startsWith("cancelled") &&
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
                s instanceof RouteStop)
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
                s instanceof RouteStop &&
                !s.status.slug.startsWith("cancelled"))
            .find(s =>
                s.status.slug === "arrived" || s.status.slug === "not-visited") as TRouteStop;
    }

    /**
     * The future stops at which delays are expected.
     */
    public get expectedDelays(): TRouteStop[]
    {
        return this.stops
            .filter(s =>
                s instanceof RouteStop &&
                s.status.slug === "not-visited" &&
                s.isDelayed) as TRouteStop[];
    }

    /**
     * Determines whether the object contains the specified text.
     * @param text The text to search for.
     * @returns True if the object contains the specified text, otherwise false.
     */
    public containsText(text?: string): boolean
    {
        // TODO: We should find a more efficient way to do free-text search.

        if (!text)
        {
            return true;
        }

        if (this._json == null)
        {
            this._json = JSON.stringify(this, null, 1).toLowerCase();
        }

        const q = text.toLowerCase();

        return new RegExp(`^\\s*"[^"]+":.*${q}.*$|^\\s*"[^"]*${q}[^"]*",?$`, "m").test(this._json);
    }

    /**
     * Migrates the client-side state of this route to the specified route.
     * @param targetRoute The route to which client-side state should be migrated.
     */
    public migrateState(targetRoute: Route): void
    {
        // Migrate the selection state of each of the route stops in this route.
        for (const stop of this.stops)
        {
            if (stop instanceof RouteStop)
            {
                const newStop = targetRoute.stops.find(s => s.id === stop.id);
                if (newStop instanceof RouteStop)
                {
                    newStop.selected = stop.selected;
                }
            }
        }
    }
}
