import { autoinject } from "aurelia-framework";
import { LocaleService } from "../../services/locale";
import { DateTime, LocaleOptions, DateTimeFormatOptions } from "luxon";

/**
 * Represents a value converter that formats a date as a localized date string.
 * See the `Luxon` API docs for details.
 */
@autoinject
export class TimeValueConverter
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
     * formatting the time component of the specified value as a localized time string.
     * @param value The value to format.
     * @param convert True to convert to the current time zone, otherwise false. The default is true.
     * @returns A localized string representing the value.
     */
    public toView(value: DateTime | undefined | null, convert?: boolean): string | null | undefined
    {
        if (value == null)
        {
            return value;
        }

        const valueToFormat = convert === false ? value : value.toLocal();

        const formatOptions: LocaleOptions & DateTimeFormatOptions =
        {
            locale: this._localeService.locale.code,
            ...DateTime.TIME_SIMPLE,
            hour12: false
        };

        return valueToFormat.toLocaleString(formatOptions);
    }
}
