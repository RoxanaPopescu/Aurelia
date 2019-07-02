import { RoutePlanStopBase } from "./routePlanStopBase";
import { RoutePlanUnscheduledTask } from "./routePlanUnscheduledTask";
import { Consignor } from "shared/src/model/logistics/consignor";

/**
 * Represents a unscheduled stop for a route plan
 */
export class RoutePlanUnscheduledTaskStop extends RoutePlanStopBase {
  public constructor(
    // tslint:disable-next-line:no-any
    data: any,
    stopNumber: number,
    consignors: Consignor[],
    task: RoutePlanUnscheduledTask
  ) {
    super(data, stopNumber, consignors);
    this.task = task;
  }

  /**
   * The specific unplanned task for this stop
   */
  public task: RoutePlanUnscheduledTask;
}
