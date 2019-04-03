/**
 * Value converter that filters an iterable to only those items that pass the specified test.
 */
export class FilterValueConverter
{
    /**
     * Converts the value for use in the view.
     * @param value The iterable containing the items.
     * @param testFunc The function that should be used to test each item, or undefined to apply no filter.
     */
    public toView<TKey, TValue>(value: Iterable<TValue> | Iterable<[TKey, TValue]> | null | undefined, testFunc: ((item: any) => boolean) | undefined)
        : Iterable<TValue> | Iterable<[TKey, TValue]> | null | undefined
    {
        if (value == null || testFunc == null)
        {
            return value;
        }

        if (value instanceof Array)
        {
            return value.filter(testFunc);
        }
        else if (value instanceof Set)
        {
            return new Set<TValue>(Array.from(value).filter(testFunc));
        }
        else if (value instanceof Map)
        {
            return new Map<TKey, TValue>(Array.from(value).filter(testFunc));
        }

        throw new Error("The 'value' argument must be of type 'Array', 'Set' or 'Map'.");
    }
}
