import { autoinject } from "aurelia-framework";
import { DateTime, LocaleOptions, DateTimeFormatOptions, Info } from "luxon";
import { LocaleService } from "../../services/locale";

/**
 * Represents the supported weekday style values.
 */
export type WeekdayStyle = "narrow" | "short" | "long";

/**
 * Represents a value converter that formats a date or ISO weekday number as a localized weekday string.
 * See the `Luxon` API docs for details.
 */
@autoinject
export class WeekdayValueConverter
{
    /**
     * Creates a new instance of the type.
     * @param localeService The `LocaleService` instance.
     */
    public constructor(localeService: LocaleService)
    {
        this._localeService = localeService;
    }

    private readonly _localeService: LocaleService;

    /**
     * Converts the value for use in the view,
     * formatting the date component of the specified value as a localized date string, using the specified style.
     * @param value The value to format, which may be a `DateTime` or an ISO weekday number in the range [1, 7].
     * @param style The style to use. The default is `long`.
     * @param convert True to convert to the current time zone, otherwise false. The default is true.
     * @returns A localized string representing the value.
     */
    public toView(value: DateTime | number | undefined | null, style: WeekdayStyle = "long", convert = true): string | null | undefined
    {
        if (value == null)
        {
            return value;
        }

        if (typeof value === "number")
        {
            return Info.weekdays(style)[value - 1];
        }

        const valueToFormat = convert ? value.toLocal() : value;

        const formatOptions: LocaleOptions & DateTimeFormatOptions =
        {
            locale: this._localeService.locale.code,
            weekday: style
        };

        return valueToFormat.toLocaleString(formatOptions);
    }
}
