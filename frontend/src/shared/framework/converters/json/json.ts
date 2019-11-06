/**
 * Value converter that converts between a value and its JSON representation.
 */
export class JsonValueConverter
{
    /**
     * Converts the value for use in the view.
     * @param value The value to convert to a JSON string.
     * @param replacer The replacer function to use.
     * @param space The number of spaces to use when indenting.
     * @returns The JSON string representing the value.
     */
    public toView(value: any, replacer?: (this: any, key: string, value: any) => any, space = 4): string
    {
        if (value === undefined)
        {
            return value;
        }

        return JSON.stringify(value, replacer, space);
    }

    /**
     * Converts the value for use in the model.
     * @param value The JSON string to parse.
     * @param replacer The replacer function to use.
     * @returns The value represented by the JSON string.
     */
    public fromView(value: string, replacer?: (this: any, key: string, value: any) => any): any
    {
        if (!value)
        {
            return value;
        }

        return JSON.parse(value, replacer);
    }
}
