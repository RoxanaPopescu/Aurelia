import { MapObject } from "shared/types";

/**
 * Represents the specified type, where all string keys have been transformed to lower-case.
 */
export type LowercaseKeys<T extends MapObject | null | undefined> =
    T extends MapObject ? { [K in keyof T as K extends string ? Lowercase<K> : K]: T[K] } : never;

/**
 * Gets a shallow copy of the specified object, where all string keys have been transformed to lower-case.
 * @param object The object to copy.
 * @returns A shallow copy of the specified object, where all string keys have been transformed to lower-case.
 */
export function lowerCaseKeys<T extends MapObject | null | undefined>(object: T): LowercaseKeys<T>
{
    if (object == null)
    {
        return object as any;
    }

    const result = {} as any;

    for (const key of Object.keys(object))
    {
        result[key.toLowerCase()] = object[key];
    }

    return result;
}
