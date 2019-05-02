type Value<TKey, TValue> = Iterable<TValue> | Iterable<[TKey, TValue]> | null | undefined;

/**
 * Value converter that reverses the order of the items in an iterable.
 */
export class ReverseValueConverter
{
    /**
     * Converts the value for use in the view.
     * @param value The iterable containing the items.
     * @returns A new iterable, containing the items in reverse order.
     */
    public toView<TKey, TValue>(value: Value<TKey, TValue>): Value<TKey, TValue>
    {
        if (value == null)
        {
            return value;
        }

        if (value instanceof Array)
        {
            return value.slice().reverse();
        }
        else if (value instanceof Set)
        {
            return new Set<TValue>(Array.from(value).reverse());
        }
        else if (value instanceof Map)
        {
            return new Map<TKey, TValue>(Array.from(value).reverse());
        }

        throw new Error("The 'value' argument must be of type 'Array', 'Set' or 'Map'.");
    }
}
