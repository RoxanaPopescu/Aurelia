import { LegacyRoutePlanStopBase } from "./routePlanStopBase";
import { LegacyRoutePlanUnscheduledTask } from "./routePlanUnscheduledTask";
import { Consignor } from "shared/src/model/logistics/consignor";

/**
 * Represents a unscheduled stop for a route plan
 */
export class LegacyRoutePlanUnscheduledTaskStop extends LegacyRoutePlanStopBase {
  public constructor(
    // tslint:disable-next-line:no-any
    data: any,
    stopNumber: number,
    consignors: Consignor[],
    task: LegacyRoutePlanUnscheduledTask
  ) {
    super(data, stopNumber, consignors);
    this.task = task;
  }

  /**
   * The specific unplanned task for this stop
   */
  public task: LegacyRoutePlanUnscheduledTask;
}
