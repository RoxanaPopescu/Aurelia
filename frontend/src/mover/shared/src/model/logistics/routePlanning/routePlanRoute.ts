import {
  RoutePlanRouteDirections,
  RoutePlanRouteStop,
  RoutePlanMeta
} from "./";
import { Consignor } from "shared/src/model/logistics/consignor";

/**
 * Represents a Route in a route plan
 */
export class RoutePlanRoute {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any, consignors: Consignor[], routeNumber: number) {
    this.id = data.id;
    this.slug = data.slug;
    this.color = "#" + data.color;
    this.stops = data.stops.map(
      (s, i) => new RoutePlanRouteStop(s, i + 1, consignors, this)
    );
    this.meta = new RoutePlanMeta(data.meta);
    this.directions = new RoutePlanRouteDirections(data.directions);
    this.routeNumber = routeNumber;
  }

  /**
   * The number in the list
   */
  public routeNumber: number;

  /**
   * The id for this route
   */
  public id: string;

  /**
   * The human readable slug
   */
  public slug: string;

  /**
   * The color assigned to this route, which should be used when visualizing the route.
   */
  public color: string;

  /**
   * The stops representing this route
   */
  public stops: RoutePlanRouteStop[];

  /**
   * The metadata for this route
   */
  public meta: RoutePlanMeta;

  /**
   * The driving directions for this route
   */
  public directions: RoutePlanRouteDirections;

  /**
   * The bounds of the stops in this route
   */
  public get mapBounds(): google.maps.LatLngBounds {
    let bounds = new google.maps.LatLngBounds();

    this.stops.map(stop =>
      bounds.extend(stop.location.position!.toGoogleLatLng())
    );

    return bounds;
  }
}
