import { autoinject } from "aurelia-framework";
import { DateTime, Duration } from "luxon";

/**
 * Represents a value converter that gets or sets the time of day,
 * represented as a `Duration` instance, of a `DateTime` instance.
 * Use this when binding a time input to a `DateTime` value.
 */
@autoinject
export class TimeOfDayValueConverter
{
    private _value: DateTime | undefined | null;

    /**
     * Converts the value for use in the view.
     * @param value The value to convert.
     * @returns A `Duration` instance representing the time of day of the specified date.
     */
    public toView(value: DateTime | undefined | null): Duration | null | undefined
    {
        this._value = value;

        if (value == null)
        {
            return value;
        }

        return value.diff(value.startOf("day"));
    }

    /**
     * Converts the value for use in the model.
     * @param value The value to convert.
     * @param date The date on which the return value should be based, or undefined to use the last converted date.
     * @returns A `DateTime` instance representing the most recent date, with the specified time of day.
     */
    public fromView(value: Duration | undefined | null, date?: DateTime): DateTime | null | undefined
    {
        if (this._value == null && date == null)
        {
            throw new Error("Cannot convert a time of day to date and time, when no date has been set.");
        }

        if (value == null)
        {
            return value;
        }

        const newValue = (date ?? this._value)!.startOf("day").plus(value);

        // Only update the value if it changed, to avoid infinite update loops.
        if (this._value == null || newValue.valueOf() !== this._value.valueOf())
        {
            this._value = newValue;
        }

        return this._value;
    }
}
