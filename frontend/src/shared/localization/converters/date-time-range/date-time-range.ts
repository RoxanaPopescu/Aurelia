import { autoinject } from "aurelia-framework";
import { DateTimeRange } from "shared/types";
import { DateTimeStyle, DateTimeValueConverter } from "../date-time/date-time";
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
     * @returns A localized string representing the value.
     */
    public toView(value: DateTimeRange, style?: DateTimeStyle, convert?: boolean): string | null | undefined
    {
        if (value == null)
        {
            return value;
        }

        const includeToDate =
            value.from != null &&
            value.to != null &&
            value.to.diff(value.from).as("day") > 1;

        const from = this._dateTimeValueConverter.toView(value.from, style, convert);

        const to = includeToDate
            ? this._dateTimeValueConverter.toView(value.to, style, convert)
            : this._timeValueConverter.toView(value.to, "narrow", convert);

        return `${from || ""} – ${to || ""}`.trim();
    }
}
