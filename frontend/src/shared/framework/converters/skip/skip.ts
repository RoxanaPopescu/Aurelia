type Value<TKey, TValue> = Iterable<TValue> | Iterable<[TKey, TValue]> | null | undefined;

/**
 * Value converter that skips up to the specified number of items in an iterable.
 */
export class SkipValueConverter
{
    /**
     * Converts the value for use in the view.
     * @param value The iterable containing the items.
     * @param count The number of items to skip, or undefined to skip no items.
     * @returns A new iterable, containing the remaining items.
     */
    public toView<TKey, TValue>(value: Value<TKey, TValue>, count: number): Value<TKey, TValue>
    {
        if (value == null)
        {
            return value;
        }

        if (value instanceof Array)
        {
            return value.slice(count);
        }
        else if (value instanceof Set)
        {
            return new Set<TValue>(Array.from<TValue>(value).slice(count));
        }
        else if (value instanceof Map)
        {
            return new Map<TKey, TValue>(Array.from<[TKey, TValue]>(value).slice(count));
        }

        throw new Error("The 'value' argument must be of type 'Array', 'Set' or 'Map'.");
    }
}
