import { Route as AbstractRoute } from "../route";
import { RouteStopBase } from "../route-stop-base";
import { RouteStop } from "./route-stop";

/**
 * Represents a route currently being tracked.
 */
export class Route extends AbstractRoute<RouteStop>
{
    public constructor(data: any)
    {
        const stops = data.stops
            .map((s, i: number) => s.hidden ? new RouteStopBase(s, i) : new RouteStop(s, i + 1));

        super(data, stops);
    }
}
