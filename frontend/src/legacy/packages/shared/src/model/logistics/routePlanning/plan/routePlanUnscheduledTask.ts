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
    this.pickup = new RoutePlanUnscheduledTaskStop(
      data.pickup,
      1,
      consignors,
      this
    );
    this.delivery = new RoutePlanUnscheduledTaskStop(
      data.delivery,
      1,
      consignors,
      this
    );

    this.reasons = data.reasons;
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
  public pickup: RoutePlanUnscheduledTaskStop;

  /**
   * The delivery stop for this unscheduled task
   */
  public delivery: RoutePlanUnscheduledTaskStop;


  /**
   * The reason this unscheduled task failed
   */
  public reasons: string[];

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
