type Value<TKey, TValue> = Iterable<TValue> | Iterable<[TKey, TValue]> | null | undefined;

/**
 * Value converter that takes at most the specified number of items from an iterable.
 */
export class TakeValueConverter
{
    /**
     * Converts the value for use in the view.
     * @param value The iterable containing the items.
     * @param count The max number of items to take, or undefined to take all items.
     * @returns A new iterable, containing the items taken.
     */
    public toView<TKey, TValue>(value: Value<TKey, TValue>, count?: number): Value<TKey, TValue>
    {
        if (value == null || count == null)
        {
            return value;
        }

        if (count < 0)
        {
            throw new Error("The 'count' argument must be positive.");
        }

        if (value instanceof Array)
        {
            return value.slice(0, count);
        }
        else if (value instanceof Set)
        {
            return new Set<TValue>(Array.from(value).slice(0, count));
        }
        else if (value instanceof Map)
        {
            return new Map<TKey, TValue>(Array.from(value).slice(0, count));
        }

        throw new Error("The 'value' argument must be of type 'Array', 'Set' or 'Map'.");
    }
}
