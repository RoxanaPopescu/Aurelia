import { autoinject } from "aurelia-framework";
import { DateTime } from "luxon";
import { DateTimeValueConverter, DateTimeStyle } from "../date-time/date-time";
import { TimeValueConverter } from "../time/time";

/**
 * Represents a value converter that formats a date and time range value as a localized date and time range string.
 */
@autoinject
export class DateTimeRangeValueConverter
{
    /**
     * Creates a new instance of the type.
     * @param dateTimeValueConverter The `DateTimeValueConverter` instance.
     * @param timeValueConverter The `TimeValueConverter` instance.
     */
    public constructor(dateTimeValueConverter: DateTimeValueConverter, timeValueConverter: TimeValueConverter)
    {
        this._dateTimeValueConverter = dateTimeValueConverter;
        this._timeValueConverter = timeValueConverter;
    }

    private readonly _dateTimeValueConverter: DateTimeValueConverter;
    private readonly _timeValueConverter: TimeValueConverter;

    /**
     * The signals that should trigger a binding update.
     */
    public readonly signals = ["locale-changed"];

    /**
     * Converts the value for use in the view,
     * formatting the specified value as a localized date and time range string, using the specified style.
     * @param value The value to format.
     * @param style The style to use. The default is `short`.
     * @param convert True to convert to the current time zone, otherwise false. The default is true.
     * @param omitEndDate True to omit the end date if less than 24 hours from the start, otherwise false. The default is true.
     * @returns A localized string representing the value.
     */
    public toView(value: { from?: DateTime; to?: DateTime }, style?: DateTimeStyle, convert?: boolean, omitEndDate = true): string | null | undefined
    {
        if (value == null)
        {
            return value;
        }

        const start = this._dateTimeValueConverter.toView(value.from, style, convert);
        let end = this._dateTimeValueConverter.toView(value.to, style, convert);

        if (start === end)
        {
            return start;
        }

        if (omitEndDate && value.from != null && value.to != null && value.to.diff(value.from).as("hours") <= 24)
        {
            end = this._timeValueConverter.toView(value.to, "narrow", convert);
        }

        return `${start || ""} – ${end || ""}`.trim();
    }
}
