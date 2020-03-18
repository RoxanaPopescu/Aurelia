/**
 * Groups the specified items by the value returned by the specified function.
 * @param items The items to group.
 * @param keyFunc A function that will be executed for each item, to get the value by which the items should be grouped, or undefined to group by the value of the item itself.
 * @returns A map in which the keys represent the groups, and the values represent the items in each group.
 */
export function groupItems<TItem, TKey = TItem>(items: Iterable<TItem>, keyFunc?: (item: TItem) => TKey): Map<TKey, TItem[]>
{
    const map = new Map<any, TItem[]>();

    for (const item of items)
    {
        const key = keyFunc != null ? keyFunc(item) : item;
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
