import { autoinject } from "aurelia-framework";
import { DateTimeRange } from "shared/types";
import { DateStyle, DateValueConverter } from "../date/date";

/**
 * Represents a value converter that formats a date and time range value as a localized date range string.
 * See the `Luxon` API docs for details.
 */
@autoinject
export class DateRangeValueConverter
{
    /**
     * Creates a new instance of the type.
     * @param dateValueConverter The `DateValueConverter` instance.
     */
    public constructor(dateValueConverter: DateValueConverter)
    {
        this._dateValueConverter = dateValueConverter;
    }

    private readonly _dateValueConverter: DateValueConverter;

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
    public toView(value: DateTimeRange, style?: DateStyle, convert?: boolean): string | null | undefined
    {
        if (value == null)
        {
            return value;
        }

        const from = this._dateValueConverter.toView(value.from, style, convert);
        const to = this._dateValueConverter.toView(value.to, style, convert);

        return `${from || ""} – ${to || ""}`.trim();
    }
}
