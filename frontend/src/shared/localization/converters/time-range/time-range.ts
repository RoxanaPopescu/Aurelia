import { autoinject } from "aurelia-framework";
import { DateTime, Duration } from "luxon";
import { TimeValueConverter } from "../time/time";

/**
 * Represents a value converter that formats a date and time range value as a localized date range string.
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
    public toView(value: { from?: DateTime | Duration; to?: DateTime | Duration }, convert?: boolean): string | null | undefined
    {
        if (value == null)
        {
            return value;
        }

        const start = this._timeValueConverter.toView(value.from, "narrow", convert);
        const end = this._timeValueConverter.toView(value.to, "narrow", convert);

        if (start === end)
        {
            return start;
        }

        return `${start || ""} – ${end || ""}`.trim();
    }
}
