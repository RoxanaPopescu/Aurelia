/**
 * Represents a time during the day.
 */
export class TimeOfDay {

  /**
   * Creates a new instance of the type, based on the specified string,
   * which must be in the ISO8601 time-of-day format.
   * @param text The string from which the instance should be created..
   * @returns The new instance.
   */
  public static fromISO(text: string): TimeOfDay {
    const parts = text.split(/:|\./g);
    const result = new TimeOfDay();
    result.hours = parseInt(parts[0], 10);
    result.minutes = parseInt(parts[1] || "0", 10);
    result.seconds = parseInt(parts[2] || "0", 10);
    result.milliseconds = parseInt(parts[3] || "0", 10);
    return result;
  }

  /**
   * The hours since the beginning of the day.
   */
  public hours: number;

  /**
   * The minutes since the beginning of the hour.
   */
  public minutes: number;

  /**
   * The seconds since the beginnign of the minute.
   */
  public seconds: number;

  /**
   * The milliseconds since the beginnign of the minute.
   */
  public milliseconds: number;

  /**
   * Formats the time of day as a string.
   * @param precision The precision of the formatted time.
   * @returns The formatted time, which at full presision has the format "hh:mm:ss.sss".
   */
  public toString(precision: "hour" | "minute" | "second" | "millisecond" = "minute") {

    let result = `${this.hours >= 10 ? this.hours : "0" + this.hours}`;

    if (precision !== "hour") {
      result += `:${this.minutes >= 10 ? this.minutes : "0" + this.minutes}`;

      if (precision !== "minute") {
        result += `:${this.seconds >= 10 ? this.seconds : "0" + this.seconds}`;

        if (precision !== "second") {
          result += `.${this.milliseconds >= 10 ? this.milliseconds : "0" + this.milliseconds}`;
        }
      }
    }

    return result;
  }
}