import { DateTime, LocaleOptions, DateTimeFormatOptions } from "luxon";

/**
 * Represents a time of a day.
 * @deprecated This class is deprecated and should not be used.
 * Use the `Duration` class from Luxon instead, and note that in JSON,
 * time should ideally be represented as an ISO 8601 period, or
 * alternatively as seconds since midnight.
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
        let result = this.hour.toString().padStart(2, "0");

        if (precision !== "hour")
        {
            result += `:${this.minute.toString().padStart(2, "0")}`;

            if (precision !== "minute")
            {
                result += `:${this.second.toString().padStart(2, "0")}`;

                if (precision !== "second")
                {
                    result += `.${this.millisecond.toString().padStart(3, "0")}`;
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
     * Gets the primitive value of the instance, as the number of milliseconds since midnight.
     * @returns The number of milliseconds since midnight.
     */
    public valueOf(): number
    {
        return (this.hour * 60 * 60 * 1000) + (this.minute * 60 * 1000) + (this.second * 1000) + (this.millisecond);
    }

    /**
     * Creates a new instance of the class, based on the specified string,
     * which must be in the ISO8601 time-of-day format.
     * @param text The string from which the instance should be created..
     * @returns The new instance.
     */
    public static fromString(text: string): TimeOfDay
    {
        const parts = text.split(/:|\./g);
        const result = new TimeOfDay();

        result.hour = parseInt(parts[0]);
        result.minute = parseInt(parts[1] || "0");
        result.second = parseInt(parts[2] || "0");
        result.millisecond = parseFloat(`0.${parts[3] || "0"}`) * 1000;

        return result;
    }
}
