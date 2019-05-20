/**
 * Value converter that removes leading and trailing whitespace from a string.
 */
export class TrimValueConverter
{
    /**
     * Converts the value for use in the view.
     * @param value The string to trim.
     * @returns The trimmed string.
     */
    public toView<TKey, TValue>(value: string): string
    {
        if (value == null)
        {
            return value;
        }

        return value.trim();
    }
}
