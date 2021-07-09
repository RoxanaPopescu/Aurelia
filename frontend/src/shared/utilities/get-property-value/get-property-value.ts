/**
 * Gets the value at the specified property path, starting from the specified object.
 * @param object The object from which the property access should start.
 * @param propertyPath The property path to access, starting with a property on the specified object.
 */
export function getPropertyValue(object: {}, propertyPath: string): any
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
