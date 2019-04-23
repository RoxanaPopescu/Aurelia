import { Route as RouteBase } from "../route";
import { RouteStopBase } from "../routeStopBase";
import { RouteStop } from "./routeStop";

/**
 * Represents the live status of a route.
 */
export class Route extends RouteBase<RouteStop> {
  
  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {

    const stops = data.stops
      .map((s, i) => s.hidden ? new RouteStopBase(s, i) : new RouteStop(s, i + 1));

    super(data, stops);
  }
}
