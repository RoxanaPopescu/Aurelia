import {
  LegacyRoutePlanRouteDirections,
  LegacyRoutePlanRouteStop,
  LegacyRoutePlanMeta
} from "..";
import { Consignor } from "shared/src/model/logistics/consignor";

/**
 * Represents a Route in a route plan
 */
export class LegacyRoutePlanRoute {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any, consignors: Consignor[], routeNumber: number) {
    this.id = data.id;
    this.slug = data.slug;
    this.color = "#" + data.color;
    this.stops = data.stops.map(
      (s, i) => new LegacyRoutePlanRouteStop(s, i + 1, consignors, this)
    );
    this.meta = new LegacyRoutePlanMeta(data.meta);
    this.directions = new LegacyRoutePlanRouteDirections(data.directions);
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
  public stops: LegacyRoutePlanRouteStop[];

  /**
   * The metadata for this route
   */
  public meta: LegacyRoutePlanMeta;

  /**
   * The driving directions for this route
   */
  public directions: LegacyRoutePlanRouteDirections;

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
