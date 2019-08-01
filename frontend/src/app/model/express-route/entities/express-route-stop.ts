import { RouteStopBase, RouteCriticality } from "app/model/route";
import { RouteStopType } from "./route-stop-type";

/**
 * Represents a single location, where a driver must either pick up or deliver colli.
 */
export class ExpressRouteStop extends RouteStopBase
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any, stopNumber: number, criticality?: RouteCriticality)
    {
        super(data, stopNumber);

        this.type = new RouteStopType(data.type);
        this.orderIds = data.orderIds;
        this.criticality = criticality;
    }

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
}
