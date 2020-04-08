import { RoutePlanUnscheduledTaskStop } from "..";
import { Consignor } from "shared/src/model/logistics/consignor";

export type RoutePlanUnscheduledTaskReason =
  | "TooManyColli"
  | "NotEnoughVehicles"
  | "UnreachableLocation"
  | "TimeRestrictionsNotMet"
  | "Unknown";

/**
 * Represents a unscheduled task for a route plan.
 * This contains start and end stops - sometimes X
 */
export class RoutePlanUnscheduledTask {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any, taskNumber: number, consignors: Consignor[]) {
    this.pickupStop = new RoutePlanUnscheduledTaskStop(
      data.pickupStop,
      1,
      consignors,
      this
    );
    this.deliveryStop = new RoutePlanUnscheduledTaskStop(
      data.deliveryStop,
      1,
      consignors,
      this
    );

    if (data.returnStop) {
      this.returnStop = new RoutePlanUnscheduledTaskStop(
        data.returnStop,
        1,
        consignors,
        this
      );
    }

    this.reason = data.reason;
    this.orderIds = data.orderIds;
    this.colliCount = data.colliCount;
    this.consignors = data.consignorIndexes.map(s => consignors[s as number]);
    this.taskNumber = taskNumber;
  }

  /**
   * The taks number
   */
  public taskNumber: number;

  /**
   * The pickup stop for this unscheduled task
   */
  public pickupStop: RoutePlanUnscheduledTaskStop;

  /**
   * The delivery stop for this unscheduled task
   */
  public deliveryStop: RoutePlanUnscheduledTaskStop;

  /**
   * The return stop for this unscheduled task
   */
  public returnStop?: RoutePlanUnscheduledTaskStop;

  /**
   * The reason this unscheduled task failed
   */
  public reason: RoutePlanUnscheduledTaskReason;

  /**
   * The orders for this unplanned task
   */
  public orderIds: string[];

  /**
   * Amount of colli to be picked up or delivered
   */
  public colliCount: number;

  /**
   * Consignors for this unplanned t ask
   */
  public consignors: Consignor[];
}
