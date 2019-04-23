import { RoutePlanRoute, RoutePlanMeta, RoutePlanUnscheduledTask } from ".";
import { Consignor } from "shared/src/model/logistics/consignor";

export type RoutePlanStatus =
  | "Processing"
  | "ProcessingExternally"
  | "WaitingForApproval"
  | "Completed"
  | "FailedExternally"
  | "FailedInternally"
  | "Cancelled";

/**
 * Represents the status of a route planning job, eventually including the planned routes.
 */
export class RoutePlan {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any, id: string) {
    this.id = id;
    // Consignors are found by index in each stop (Unscheduled & normal stops)
    const consignors = data.consignors.map(s => new Consignor(s));

    this.status = data.status;
    this.meta = new RoutePlanMeta(data.meta);
    this.routes = data.routes.map(
      (s, index) => new RoutePlanRoute(s, consignors, index + 1)
    );
    this.unscheduledTasks = data.unscheduledTasks.map(
      (s, i) => new RoutePlanUnscheduledTask(s, i + 1, consignors)
    );
  }

  /**
   * The ID of the route plan.
   */
  public id: string;

  /**
   * The status of the route plan.
   */
  public status: RoutePlanStatus;

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
}
