import { TimeOfDay } from "shared/src/model/general/timeOfDay";

export class TimeSlot {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    this.deliveryTimeFrom = TimeOfDay.fromISO(
      data.deliveryTimeRange.from.timeOfDay
    );
    this.deliveryTimeTo = TimeOfDay.fromISO(
      data.deliveryTimeRange.to.timeOfDay
    );
    this.deliveryDayOfWeek = data.deliveryTimeRange.from.dayOfWeek.value;
    this.executionTime = TimeOfDay.fromISO(data.executionTime.timeOfDay);
    this.executionDayOfWeek = data.executionTime.dayOfWeek;
  }

  public deliveryTimeFrom: TimeOfDay;

  public deliveryTimeTo: TimeOfDay;

  public deliveryDayOfWeek: number;

  public executionTime: TimeOfDay;

  public executionDayOfWeek: number;
}
