import { getPropertyValue } from "../get-property-value/get-property-value";

/**
 * Groups the specified items by the value returned by the specified function.
 * @param items The items to group.
 * @param propertyPath The property path to access on each item, to get the value by which the items should be grouped, or undefined to group by the value of the item itself.
 * @returns A new `Map` instance in which the keys represent the groups, and the values represent the items in each group.
 */
export function groupItems<TItem, TKey = TItem>(items: Iterable<TItem>, propertyPath?: string): Map<TKey, TItem[]>;

/**
 * Groups the specified items by the value returned by the specified function.
 * @param value The iterable containing the items.
 * @param func A function that will be executed for each item, to get the value by which the items should be grouped, or undefined to group by the value of the item itself.
 * @returns A new `Map` instance in which the keys represent the groups, and the values represent the items in each group.
 */
export function groupItems<TItem, TKey = TItem>(items: Iterable<TItem>, func?: (item: TItem) => TKey): Map<TKey, TItem[]>;

export function groupItems<TItem, TKey = TItem>(items: Iterable<TItem>, propertyPathOrFunc?: string | ((item: TItem) => TKey)): Map<TKey, TItem[]>
{
    const map = new Map<any, TItem[]>();

    for (const item of items)
    {
        const key =
            propertyPathOrFunc == null ? item :
            propertyPathOrFunc instanceof Function ? propertyPathOrFunc(item) :
            getPropertyValue(item, propertyPathOrFunc);

        const array = map.get(key);

        if (array != null)
        {
            array.push(item);
        }
        else
        {
            map.set(key, [item]);
        }
    }

    return map;
}
