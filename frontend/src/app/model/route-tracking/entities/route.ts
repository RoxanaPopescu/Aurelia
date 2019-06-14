import { RouteBase, RouteStopInfo } from "app/model/routes";
import { RouteStop } from "./route-stop";

/**
 * Represents a route currently being tracked.
 */
export class Route extends RouteBase<RouteStop>
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        const stops = data.stops
            .map((s, i: number) => s.hidden ? new RouteStopInfo(s, i) : new RouteStop(s, i + 1));

        super(data, stops);
    }
}
