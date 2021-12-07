import { RoutePlanRoute } from "./routePlanRoute";
import { RoutePlanStopBase } from "./routePlanStopBase";
import { RoutePlanRouteStopEstimates } from "./routePlanRouteStopEstimates";
import { Consignor } from "shared/src/model/logistics/consignor";
import { RouteStopType } from "app/model/route";

/**
 * Represents one stop for a route plan route
 */
export class RoutePlanRouteStop extends RoutePlanStopBase {
  public constructor(
    /* tslint:disable-next-line: no-any */
    data: any,
    stopNumber: number,
    consignors: Consignor[],
    route: RoutePlanRoute
  ) {
    super(data, stopNumber, consignors);
    this.estimates = new RoutePlanRouteStopEstimates(data.estimates);
    this.orderIds = data.orderIds;
    this.colliCount = data.colliCount;
    this.consignors = data.consignorIndexes.map(s => consignors[s as number]);
    this.route = route;
    this.type = new RouteStopType(data.type);
  }

  /**
   * Estimates for this route stop.
   */
  public estimates: RoutePlanRouteStopEstimates;

  /**
   * The orders for this stop
   */
  public orderIds: string[];

  /**
   * Amount of colli to be picked up or delivered
   */
  public colliCount: number;

  /**
   * Consignors for this stop
   */
  public consignors: Consignor[];

  /**
   * The specific route for this stop
   */
  public route: RoutePlanRoute;

  /**
   * The type of stop
   */
   public type: RouteStopType;
}
