import { MapObject } from "../../types";

/**
 * Gets a shallow copy of the specified object, where all keys have been transformed to lower-case.
 * @param object The object to copy.
 * @returns A shallow copy of the specified object, where all keys have been transformed to lower-case.
 */
export function lowerCaseKeys<T extends MapObject | null | undefined>(object: T): any
{
    if (object == null)
    {
        return object;
    }

    const result = {} as any;

    for (const key of Object.keys(object!))
    {
        result[key.toLowerCase()] = object[key];
    }

    return result;
}
