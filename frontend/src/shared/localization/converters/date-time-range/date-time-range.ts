import { autoinject } from "aurelia-framework";
import { DateTimeRange } from "shared/types";
import { DateTimeStyle, DateTimeValueConverter } from "../date-time/date-time";

/**
 * Represents a value converter that formats a date and time range value as a localized date and time range string.
 * See the `Luxon` API docs for details.
 */
@autoinject
export class DateTimeRangeValueConverter
{
    /**
     * Creates a new instance of the type.
     * @param dateTimeValueConverter The `DateTimeValueConverter` instance.
     */
    public constructor(dateTimeValueConverter: DateTimeValueConverter)
    {
        this._dateTimeValueConverter = dateTimeValueConverter;
    }

    private readonly _dateTimeValueConverter: DateTimeValueConverter;

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

        const from = this._dateTimeValueConverter.toView(value.from, style, convert);
        const to = this._dateTimeValueConverter.toView(value.to, style, convert);

        return `${from || ""} – ${to || ""}`.trim();
    }
}
