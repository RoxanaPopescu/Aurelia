import { MapObject } from "shared/types";

/**
 * Gets the value at the specified property path, starting from the specified object.
 * Note that only simple property access is supported, i.e. no array indexes or method calls.
 * @param object The object from which the property access should start.
 * @param propertyPath The property path to access, starting with a property on the specified object.
 * @returns The value at the specified property path.
 */
export function getPropertyValue(object: MapObject | null | undefined, propertyPath: string): any
{
    let result = object;

    for (const propertyName of propertyPath.split("."))
    {
        if (result == null)
        {
            return result;
        }

        result = result[propertyName];
    }

    return result;
}
