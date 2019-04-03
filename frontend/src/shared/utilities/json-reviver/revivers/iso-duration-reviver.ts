import { Duration } from "luxon";

/**
 * Represents a JSON reviver function which revives strings matching the ISO 8601 duration format as `Duration` instances.
 * @param key The name of the property being revived.
 * @param value The value of the property being rebived.
 * @returns The revived value, or undefined if the reviver could not handle the value.
 */
export function isoDurationReviver(key: string, value: any): any
{
    if (typeof value === "string" && !/^\d*$/.test(value))
    {
        const duration = Duration.fromISO(value);

        if (duration.isValid)
        {
            return duration;
        }
    }

    return undefined;
}
