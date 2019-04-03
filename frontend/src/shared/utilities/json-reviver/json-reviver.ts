import { isoDateReviver } from "./revivers/iso-date-reviver";
import { isoDurationReviver } from "./revivers/iso-duration-reviver";

// The revivers to try, ordered by priority.
// Note that if a reviver returns undefined, it is assumed it could not handle the value.
const revivers =
[
    isoDateReviver,
    isoDurationReviver
];

/**
 * Represents a JSON reviver function which attempts to revive the value using one of the available revivers.
 * @param key The name of the property being revived.
 * @param value The value of the property being rebived.
 * @returns The revived value, or the original value if no reviver was found.
 */
export function jsonReviver(key: string, value: any): any
{
    for (const reviver of revivers)
    {
        const result = reviver(key, value);

        if (result !== undefined)
        {
            return result;
        }
    }

    return value;
}
