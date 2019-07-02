import { Position } from "shared/src/model/general/position";

/**
 * Represents metadata for a route plan or route plan route
 */
export class RoutePlanRouteDirections {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    this.isOptimized = data.isOptimized;
    this.path = data.positions.map(s => new Position(s));
  }

  /**
   * If the points are optimized they should show correct driving directions
   * If it's not optimized it will be straight lines between the stops
   */
  public isOptimized: boolean;

  /**
   * The path of the directions.
   */
  public path: Position[];

  public pathToGoogleLatLng(): google.maps.LatLng[] {
    return this.path.map(s => new google.maps.LatLng(s.latitude, s.longitude));
  }
}
