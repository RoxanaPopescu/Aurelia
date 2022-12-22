/**
 * Value converter that multiplies the scales the model value by the specified factor.
 */
export class ScaleValueConverter
{
    /**
     * Converts the value for use in the view.
     * @param value The value to scale.
     * @param factor The factor by which the value should scaled.
     * @returns The value, multiplied by the specified factor.
     */
    public toView<TKey, TValue>(value: number | undefined | null, factor: number): number | undefined | null
    {
        if (value == null)
        {
            return value;
        }

        return value * factor;
    }

    /**
     * Converts the value for use in the model.
     * @param value The value to scale.
     * @param factor The factor by which the value should scaled.
     * @returns The value, divided by the specified factor.
     */
    public fromView<TKey, TValue>(value: number | undefined | null, factor: number): number | undefined | null
    {
        if (value == null)
        {
            return value;
        }

        return value / factor;
    }
}
