import { autoinject } from "aurelia-framework";
import { DateTimeRange, TimeRange } from "shared/types";
import { TimeValueConverter } from "../time/time";

/**
 * Represents a value converter that formats a date and time range value as a localized date range string.
 * See the `Luxon` API docs for details.
 */
@autoinject
export class TimeRangeValueConverter
{
    /**
     * Creates a new instance of the type.
     * @param timeValueConverter The `TimeValueConverter` instance.
     */
    public constructor(timeValueConverter: TimeValueConverter)
    {
        this._timeValueConverter = timeValueConverter;
    }

    private readonly _timeValueConverter: TimeValueConverter;

    /**
     * Converts the value for use in the view,
     * formatting the specified value as a localized date and time range string, using the specified style.
     * @param value The value to format.
     * @param style The style to use. The default is `short`.
     * @param convert True to convert to the current time zone, otherwise false. The default is true.
     * @returns A localized string representing the value.
     */
    public toView(value: DateTimeRange | TimeRange, convert?: boolean): string | null | undefined
    {
        if (value == null)
        {
            return value;
        }

        const from = this._timeValueConverter.toView(value.from, "narrow", convert);
        const to = this._timeValueConverter.toView(value.to, "narrow", convert);

        return `${from || ""} – ${to || ""}`.trim();
    }
}
