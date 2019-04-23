import { DateTime, Duration } from "luxon";

export class DateHelper {
  static startOfDay(seconds: number): DateTime {
    return DateTime.fromObject({})
      .startOf("day")
      .plus(
        Duration.fromObject({
          seconds: seconds
        })
      );
  }
}
