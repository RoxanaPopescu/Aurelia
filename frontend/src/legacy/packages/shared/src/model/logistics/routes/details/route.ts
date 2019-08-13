import { observable } from "mobx";
import { Route as RouteBase } from "../route";
import { RouteStopBase } from "../routeStopBase";
import { RouteStop } from "./routeStop";
import { RoutePrice } from "./routePrice";

/**
 * Represents the live status of a route.
 */
export class Route extends RouteBase<RouteStop> {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    const stops = data.stops.map(
      (s, i) => (s.hidden ? new RouteStopBase(s, i) : new RouteStop(s, i + 1))
    );

    super(data, stops);

    this.overallRating = data.overallRating;
    this.driverListUrl = data.driverListUrl;
    this.allowAssignment = data.allowAssignment;

    if (data.priceOverview) {
      this.priceOverview = new RoutePrice(data.priceOverview);
    }
  }

  /**
   * The price overview for the route.
   */
  public readonly priceOverview?: RoutePrice;

  /**
   * The overall rating of this route, calculated based on the ratings given at each stop.
   */
  public readonly overallRating?: number;

  /**
   * The link for the driver list document, formatted for printing.
   */
  public readonly driverListUrl?: string;

  /**
   * True if the route may be assigned to a fulfiller or driver,
   * otherwise false.
   */
  @observable public allowAssignment: boolean;
}
