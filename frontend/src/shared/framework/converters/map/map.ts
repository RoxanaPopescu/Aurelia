import { MapObject } from "shared/types";

/**
 * Represents a value converter that maps a sequence of items to a new `Array`,
 * containing the values of the specified property on each item in the sequence.
 */
export class MapValueConverter
{
    /**
     * Converts the value for use in the view.
     * @param value The iterable containing the items.
     * @param key The key on each item from which to get the value.
     * @returns A new `Array` containing the values of the specified property on each item in the sequence.
     */
    public toView(value: Iterable<MapObject>, key: string | ((item: any) => any), skipUndefined?: boolean): any[];

    /**
     * Converts the value for use in the view.
     * @param value The iterable containing the items.
     * @param func The function to call with each item to get the value.
     * @returns A new `Array` containing the values of the specified property on each item in the sequence.
     */
    public toView(value: Iterable<MapObject>, func: string | ((item: any) => any), skipUndefined?: boolean): any[];

    public toView(value: Iterable<MapObject>, keyOrFunc: string | ((item: any) => any), skipUndefined = true): any[]
    {
        if (value == null)
        {
            return value;
        }

        const mappedItems: any[] = [];

        for (const item of value)
        {
            if (item === undefined && skipUndefined)
            {
                continue;
            }

            let mappedItem: any;

            if (keyOrFunc instanceof Function)
            {
                mappedItem = keyOrFunc(item);
            }
            else
            {
                mappedItem = item[keyOrFunc];
            }

            if (mappedItem === undefined && !skipUndefined)
            {
                continue;
            }

            mappedItems.push(mappedItem);
        }

        return mappedItems;
    }
}
