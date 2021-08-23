/**
 * Replaces the items in the specified array, with the specified new items.
 * This is useful in binding scenarios, where replacing the array would cause unwanted rendering overhead.
 * @param array The array in which items should be replaced.
 * @param newItems The items that should be in the array.
 */
export function replaceItems(array: any[], newItems: any[]): void
{
    // Fill the array with the new items, while removing them from their existing positions.
    for (let newIndex = 0; newIndex < newItems.length; newIndex++)
    {
        const item = newItems[newIndex];
        const oldIndex = array.indexOf(item);

        if (oldIndex !== newIndex)
        {
            if (oldIndex > -1)
            {
                array.splice(oldIndex, 1);
            }

            array.splice(newIndex, 0, item);
        }
    }

    // Remove any existing items not included in the new items.
    if (array.length > newItems.length)
    {
        array.splice(newItems.length, array.length - newItems.length);
    }
}
