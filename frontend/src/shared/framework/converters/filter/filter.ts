type Value<TKey, TValue> = Iterable<TValue> | Iterable<[TKey, TValue]> | null | undefined;

/**
 * Represents a that tests whether an item should be included in the output of the `filter` value converter.
 * @param item The being tested by the value converter.
 * @param args Any additional arguments that were passed to the value converter.
 * @returns True to include the item, otherwise false.
 */
export type FilterTestFunc = ((item: any, ...args: any[]) => boolean) | undefined;

/**
 * Value converter that filters an iterable to only those items that pass the specified test.
 */
export class FilterValueConverter
{
    /**
     * Converts the value for use in the view.
     * @param value The iterable containing the items.
     * @param testFunc The function that should be used to test each item, or undefined to apply no filter.
     * @param args The arguments to pass to the test function, in addition to the value being tested.
     */
    public toView<TKey, TValue>(value: Value<TKey, TValue>, testFunc: FilterTestFunc, ...args: any[]): Value<TKey, TValue>
    {
        if (value == null || testFunc == null)
        {
            return value;
        }

        if (value instanceof Array)
        {
            return value.filter(v => testFunc(v, ...args));
        }
        else if (value instanceof Set)
        {
            return new Set<TValue>(Array.from(value).filter(v => testFunc(v, ...args)));
        }
        else if (value instanceof Map)
        {
            return new Map<TKey, TValue>(Array.from(value).filter(v => testFunc(v, ...args)));
        }

        throw new Error("The 'value' argument must be of type 'Array', 'Set' or 'Map'.");
    }
}
