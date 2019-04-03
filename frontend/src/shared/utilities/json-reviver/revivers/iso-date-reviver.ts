import { DateTime } from "luxon";

/**
 * Represents a JSON reviver function which revives strings matching the ISO 8601 date format as `DateTime` instances.
 * @param key The name of the property being revived.
 * @param value The value of the property being revived.
 * @returns The revived value, or undefined if the reviver could not handle the value.
 */
export function isoDateReviver(key: string, value: any): any
{
    if (typeof value === "string" && !/^\d*$/.test(value))
    {
        const duration = DateTime.fromISO(value, { setZone: true });

        if (duration.isValid)
        {
            return duration;
        }
    }

    return undefined;
}
