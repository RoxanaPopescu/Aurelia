import { groupItems } from "shared/utilities";

/**
 * Represents a value converter that groups a sequence of items into a new `Map`,
 * using the specified property on each item as the key.
 */
export class GroupValueConverter
{
    /**
     * Converts the value for use in the view.
     * @param value The iterable containing the items.
     * @param propertyPath The property path to access on each item, to get the value by which the items should be grouped, or undefined to group by the value of the item itself.
     * @returns A new `Map` instance in which the keys represent the groups, and the values represent the items in each group.
     */
    public toView<TItem, TKey = any>(value: Iterable<TItem>, propertyPath?: string): Map<any, TItem[]> | null | undefined;

    /**
     * Converts the value for use in the view.
     * @param value The iterable containing the items.
     * @param func A function that will be executed for each item, to get the value by which the items should be grouped, or undefined to group by the value of the item itself.
     * @returns A new `Map` instance in which the keys represent the groups, and the values represent the items in each group.
     */
    public toView<TItem, TKey = TItem>(value: Iterable<TItem>, func?: ((item: any) => any)): Map<TKey, TItem[]> | null | undefined;

    public toView<TItem>(value: Iterable<TItem>, propertyPathOrFunc?: string | ((item: TItem) => any)): Map<any, TItem[]> | null | undefined
    {
        if (value == null)
        {
            return value;
        }

        const groupedItems = groupItems(value, propertyPathOrFunc as any);

        return groupedItems;
    }
}
