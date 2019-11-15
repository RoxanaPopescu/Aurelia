import { RouteStopBase, RouteCriticality, RouteStopType } from "app/model/route";

/**
 * Represents a single location, where a driver must either pick up or deliver colli.
 */
export class ExpressRouteStop extends RouteStopBase
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any, route: any, stopNumber: number, criticality?: RouteCriticality)
    {
        super(data, stopNumber);

        this.route = route;
        this.type = new RouteStopType(data.type);
        this.orderIds = data.orderIds;
        this.criticality = criticality;
    }

    /**
     * The route to which this stop belongs.
     */
    public route: any;

    /**
     * The type of stop.
     */
    public type: RouteStopType;

    /**
     * The IDs of the orders associated with this stop.
     */
    public orderIds: string[];

    /**
     * The criticality of the route, or undefined if this is not the first stop.
     */
    public readonly criticality: RouteCriticality | undefined;

    /**
     * The number this stop will have on the new route.
     */
    public newStopNumber: number | undefined;

    /**
     * True if there is an alert for this route stop, otherwise false.
     * @returns True if there is an alert for this route stop, otherwise false.
     */
    public get hasAlert(): boolean
    {
        return this.isDelayed === true || (this.criticality != null && this.criticality.accent === "negative");
    }

    /**
     * True if there is an alert for this route stop, otherwise false.
     * @returns True if there is an alert for this route stop, otherwise false.
     */
    public get hasWarning(): boolean
    {
        return (this.criticality != null && this.criticality.accent === "attention");
    }
}
