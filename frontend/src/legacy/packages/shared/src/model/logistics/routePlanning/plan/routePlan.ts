import { RoutePlanRoute } from "./routePlanRoute";
import { RoutePlanMeta } from "./routePlanMeta";
import { RoutePlanUnscheduledTask } from "./routePlanUnscheduledTask";
import { Consignor } from "shared/src/model/logistics/consignor";
import { EntityInfo } from "app/types/entity";

export type RoutePlanStatus =
  | "waiting-for-approval"
  | "succeeded";

/**
 * Represents the status of a route planning job, eventually including the planned routes.
 */
export class RoutePlan {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any, id: string) {
    this.id = id;
    this.name = data.name;
    // Consignors are found by index in each stop (Unscheduled & normal stops)
    const consignors = data.consignors.map(s => new Consignor(s));

    this.status = data.status;
    this.waitingForApproval = data.waitingForApproval;
    this.isAutomaticApproved = data.isAutomaticApproved;
    this.routes = data.routes.map(
      (s, index) => new RoutePlanRoute(s, consignors, index + 1)
    );
    this.unscheduledTasks = data.unscheduledTasks.map(
      (s, i) => new RoutePlanUnscheduledTask(s, i + 1, consignors)
    );

    // Generate meta for whole routeplan
    let colliCount = 0;
    let drivingTime = 0;
    let waitingTime = 0;
    let taskTime = 0;
    let distance = 0;
    let orderCount = 0;
    let weight = 0;
    let volume = 0;
    let stopsCount = 0;

    let earliestEstimatedFrom = this.routes[0].meta.timeFrame.from!;
    let latestEstimatedTo = this.routes[0].meta.timeFrame.to!;

    for (const route of this.routes)
    {
        colliCount += route.meta.colliCount;
        stopsCount += route.meta.stopsCount;
        drivingTime += route.meta.drivingTime.as("seconds");
        waitingTime += route.meta.waitingTime.as("seconds");
        orderCount += route.meta.orderCount;
        taskTime += route.meta.taskTime.as("seconds");
        distance += route.meta.distance;
        weight += route.meta.weight;
        volume += route.meta.volume;
        stopsCount += route.stops.length;

        if (route.routeNumber !== 1)
        {
          if (route.meta.timeFrame.from! < earliestEstimatedFrom) {
            earliestEstimatedFrom = route.meta.timeFrame.from!;
          }

          if (route.meta.timeFrame.to! > latestEstimatedTo)
          {
              latestEstimatedTo = route.meta.timeFrame.to!;
          }
        }
    }

    this.meta = new RoutePlanMeta({
      colliCount: colliCount,
      drivingTime: drivingTime,
      waitingTime: waitingTime,
      distance: distance,
      weight: weight,
      volume: volume,
      taskTime: taskTime,
      stopsCount: stopsCount,
      orderCount: orderCount,
      timeFrame: { from: earliestEstimatedFrom, to: latestEstimatedTo }
    });

    console.log(this.meta.timeFrame.from!.toISO(), this.meta.timeFrame.to!.toISO());
  }

  /**
   * The ID of the route plan.
   */
  public id: string;

  /**
   * The name of the route plan.
   */
  public name: string;

  /**
   * The status of the route plan.
   */
  public status: RoutePlanStatus;

  /**
   * The status of the route plan.
   */
  public isAutomaticApproved: boolean;

  /**
   * The routeplan is waiting for approval
   */
  public waitingForApproval: boolean;

  /**
   * The metadata for this route plan
   */
  public meta: RoutePlanMeta;

  /**
   * The routes for this route plan
   */
  public routes: RoutePlanRoute[];

  /**
   * The unscheduled tasks for
   */
  public unscheduledTasks: RoutePlanUnscheduledTask[];

  /**
   * The bounds of the routes in this plan
   */
  public get mapBounds(): google.maps.LatLngBounds {
    let bounds = new google.maps.LatLngBounds();

    for (let route of this.routes) {
      for (let stop of route.stops) {
        bounds.extend(stop.location.position!.toGoogleLatLng());
      }
    }

    return bounds;
  }

  /**
   * Gets an `EntityInfo` instance representing this instance.
   */
  public toEntityInfo(): EntityInfo {
    return new EntityInfo({
      type: "route-plan",
      id: this.id,
      name: this.name
    });
  }
}
