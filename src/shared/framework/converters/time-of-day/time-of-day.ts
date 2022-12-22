import { autoinject } from "aurelia-framework";
import { DateTime, Duration } from "luxon";

/**
 * Represents a value converter that gets or sets the time of the day, represented
 * as a `Duration` instance, of a `DateTime` instance. Use this when binding the
 * value of a `time-input` componet to a `DateTime` instance.
 */
@autoinject
export class TimeOfDayValueConverter
{
    private _dateTime: DateTime | undefined | null;
    private _duration: Duration | undefined | null;

    /**
     * Converts the value for use in the view.
     * @param value The value to convert.
     * @returns A `Duration` instance representing the time of day of the specified date.
     */
    public toView(value: DateTime | undefined | null): Duration | null | undefined
    {
        this._dateTime = value;

        if (value == null)
        {
            return value;
        }

        const duration = value.diff(value.startOf("day")).shiftTo("hours", "minutes", "seconds", "milliseconds");

        return duration.toString() === this._duration?.toString() ? this._duration : this._duration = duration;
    }

    /**
     * Converts the value for use in the model.
     * @param value The value to convert.
     * @param date The date on which the return value should be based, or undefined to use the last converted date.
     * @returns A `DateTime` instance representing the most recent date, with the specified time of day.
     */
    public fromView(value: Duration | undefined | null, date?: DateTime): DateTime | null | undefined
    {
        if (this._dateTime == null && date == null)
        {
            throw new Error("Cannot convert a time of day to date and time, when no date has been set.");
        }

        if (value === undefined)
        {
            return undefined;
        }

        if (value === null)
        {
            // The value null indicates that the input is invalid, but we don't
            // to pass that to the model, as doing so would also clear the date.
            return this._dateTime;
        }

        const dateTime = (date ?? this._dateTime)!.startOf("day").plus(value);

        return dateTime.toString() === this._dateTime?.toString() ? this._dateTime : this._dateTime = dateTime;
    }
}
