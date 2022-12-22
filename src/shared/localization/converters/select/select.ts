import { MapObject } from "shared/types";

/**
 * Represents a value converter that takes a key, and selects the corresponding value
 * from a `Map`, `Object` or `Array`, or a default value, if specified. Use this to
 * e.g. choose a word based on the grammatical gender of another word.
 */
export class SelectValueConverter
{
    /**
     * Converts the value for use in the view,
     * selecting the value for the specified key, or the default value, if specified,
     * @param key The key for which a value should be selected.
     * @param values The values from which to select.
     * @returns The value for the specified key, or the default value, if specified.
     * @throws If the key is not found in `values` and no `defaultValue` is specified.
     */
    public toView<T>(key: any, values: Map<any, T> | MapObject<T> | T[], defaultValue?: T): T
    {
        if (values == null)
        {
            throw new Error("The 'values' argument is required.");
        }

        if (values instanceof Map)
        {
            if (values.has(key))
            {
                return values.get(key)!;
            }
        }
        else
        {
            if (key in values)
            {
                return (values as any)[key];
            }
        }

        if (defaultValue !== undefined)
        {
            return defaultValue;
        }

        throw new Error(`The 'values' argument does not include the key '${key}' and no default value was specified.`);
    }
}
