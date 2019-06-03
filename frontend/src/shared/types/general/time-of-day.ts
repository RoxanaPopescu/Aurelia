import { DateTime, LocaleOptions, DateTimeFormatOptions } from "luxon";

/**
 * Represents a time of a day.
 */
export class TimeOfDay
{
    /**
     * The hours since the beginning of the day.
     */
    public hour: number;

    /**
     * The minutes since the beginning of the hour.
     */
    public minute: number;

    /**
     * The seconds since the beginnign of the minute.
     */
    public second: number;

    /**
     * The milliseconds since the beginnign of the minute.
     */
    public millisecond: number;

    /**
     * Formats the time of day as a string.
     * @param precision The precision of the formatted time.
     * @returns The formatted time, which at full precision has the format "hh:mm:ss.sss".
     */
    public toString(precision: "hour" | "minute" | "second" | "millisecond" = "minute"): string
    {
        let result = `${this.hour >= 10 ? this.hour : `0${this.hour}`}`;

        if (precision !== "hour")
        {
            result += `:${this.minute >= 10 ? this.minute : `0${this.minute}`}`;

            if (precision !== "minute")
            {
                result += `:${this.second >= 10 ? this.second : `0${this.second}`}`;

                if (precision !== "second")
                {
                    result += `.${this.millisecond >= 10 ? this.millisecond : `0${this.millisecond}`}`;
                }
            }
        }

        return result;
    }

    /**
     * Formats the time of day as a localized string.
     * @param options The formatting options to use.
     * @returns The formatted, localized time.
     */
    public toLocaleString(options?: LocaleOptions & DateTimeFormatOptions): string
    {
        return DateTime.fromObject(this).toLocaleString(
        {
            ...options,
            ...DateTime.TIME_SIMPLE
        });
    }

    /**
     * Creates a new instance of the class, based on the specified string,
     * which must be in the ISO8601 time-of-day format.
     * @param text The string from which the instance should be created..
     * @returns The new instance.
     */
    public static fromISO(text: string): TimeOfDay
    {
        const parts = text.split(/:|\./g);
        const result = new TimeOfDay();

        result.hour = parseInt(parts[0]);
        result.minute = parseInt(parts[1] || "0");
        result.second = parseInt(parts[2] || "0");
        result.millisecond = parseInt(parts[3] || "0");

        return result;
    }
}
