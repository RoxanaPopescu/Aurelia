import {
  RoutePlanRouteDirections,
  RoutePlanRouteStop,
  RoutePlanMeta
} from "..";
import { Consignor } from "shared/src/model/logistics/consignor";
import { VehicleType } from "app/model/vehicle";

// Colors for different routes
const colors = [
  "#268bbc",
  "#1acce2",
  "#26bcae",
  "#c1e21a",
  "#db9726",
  "#ff5555",
  "#e21aa7",
  "#bd10e0"
];

/**
 * Represents a Route in a route plan
 */
export class RoutePlanRoute {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any, consignors: Consignor[], routeNumber: number) {
    const remainder = (routeNumber - 1) % colors.length;
    this.color = colors[remainder];

    this.id = data.id;
    this.slug = data.slug;
    this.vehicleGroupName = data.vehicleGroupName;
    this.stops = data.stops.map(
      (s, i) => new RoutePlanRouteStop(s, i + 1, consignors, this)
    );
    this.directions = new RoutePlanRouteDirections(data.directions);
    this.routeNumber = routeNumber;

    let colliCount = 0;
    let drivingTime = 0;
    let waitingTime = 0;
    let taskTime = 0;
    let distance = 0;
    let orderCount = 0;
    let weight = 0;
    let volume = 0;

    if (data.vehicleTypeId)
    {
      this.vehicleType = VehicleType.get(data.vehicleTypeId);
    }

    for (const stop of this.stops)
    {
      if (stop.type.slug === "pickup")
      {
          colliCount += stop.colliCount;

          if (stop.weight != null)
          {
              weight += stop.weight;
          }

          if (stop.volume != null)
          {
              volume += stop.volume;
          }

          orderCount += stop.orderIds.length;
      }

      drivingTime += stop.estimates.drivingTime.as("seconds");
      taskTime += stop.estimates.taskTime.as("seconds");
      waitingTime += stop.estimates.waitingTime.as("seconds");
      distance += stop.estimates.distance;
    }

    this.meta = new RoutePlanMeta(
      {
        colliCount: colliCount,
        drivingTime: drivingTime,
        waitingTime: waitingTime,
        distance: distance,
        weight: weight,
        volume: volume,
        taskTime: taskTime,
        stopsCount: this.stops.length,
        orderCount: orderCount,
        timeFrame: { from: this.stops[0].estimates.timeFrame.from!, to: this.stops[this.stops.length - 1].estimates.timeFrame.to! }
      }
    );
  }

  /**
   * The number in the list
   */
  public routeNumber: number;

  /**
   * The ID for this route
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
   * The vehicle type for this route
   */
  public vehicleType: VehicleType;

  /**
   * The name of the vehicle group associated with this route
   */
  public vehicleGroupName: string;

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
