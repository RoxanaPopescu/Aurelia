import { LegacyRoutePlanUnscheduledTaskStop } from "..";
import { Consignor } from "shared/src/model/logistics/consignor";

export type LegacyRoutePlanUnscheduledTaskReason =
  | "TooManyColli"
  | "NotEnoughVehicles"
  | "UnreachableLocation"
  | "TimeRestrictionsNotMet"
  | "Unknown";

/**
 * Represents a unscheduled task for a route plan.
 * This contains start and end stops - sometimes X
 */
export class LegacyRoutePlanUnscheduledTask {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any, taskNumber: number, consignors: Consignor[]) {
    this.pickupStop = new LegacyRoutePlanUnscheduledTaskStop(
      data.pickupStop,
      1,
      consignors,
      this
    );
    this.deliveryStop = new LegacyRoutePlanUnscheduledTaskStop(
      data.deliveryStop,
      1,
      consignors,
      this
    );

    if (data.returnStop) {
      this.returnStop = new LegacyRoutePlanUnscheduledTaskStop(
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
  public pickupStop: LegacyRoutePlanUnscheduledTaskStop;

  /**
   * The delivery stop for this unscheduled task
   */
  public deliveryStop: LegacyRoutePlanUnscheduledTaskStop;

  /**
   * The return stop for this unscheduled task
   */
  public returnStop?: LegacyRoutePlanUnscheduledTaskStop;

  /**
   * The reason this unscheduled task failed
   */
  public reason: LegacyRoutePlanUnscheduledTaskReason;

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
