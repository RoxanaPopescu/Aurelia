import { MapObject } from "shared/types";

/**
 * Represents a value converter that returns the keys of the specified map or object.
 */
export class KeysValueConverter
{
    /**
     * Converts the value for use in the view.
     * @param value The object containing the keys.
     * @returns The string, number and symbol keys of the own properties of an object.
     */
    public toView(value: MapObject): (string | number | symbol)[]
    {
        if (value == null)
        {
            return value;
        }

        return Reflect.ownKeys(value);
    }
}
