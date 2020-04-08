import { LegacyRoutePlanRoute } from "./routePlanRoute";
import { LegacyRoutePlanStopBase } from "./routePlanStopBase";
import { LegacyRoutePlanRouteStopEstimates } from "./routePlanRouteStopEstimates";
import { Consignor } from "shared/src/model/logistics/consignor";

/**
 * Represents one stop for a route plan route
 */
export class LegacyRoutePlanRouteStop extends LegacyRoutePlanStopBase {
  public constructor(
    /* tslint:disable-next-line: no-any */
    data: any,
    stopNumber: number,
    consignors: Consignor[],
    route: LegacyRoutePlanRoute
  ) {
    super(data, stopNumber, consignors);
    this.estimates = new LegacyRoutePlanRouteStopEstimates(data.estimates);
    this.orderIds = data.orderIds;
    this.colliCount = data.colliCount;
    this.consignors = data.consignorIndexes.map(s => consignors[s as number]);
    this.route = route;
  }

  /**
   * Estimates for this route stop.
   */
  public estimates: LegacyRoutePlanRouteStopEstimates;

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
  public route: LegacyRoutePlanRoute;
}
