import { autoinject } from "aurelia-framework";
import { LocaleService } from "../../services/locale";
import { DateTime, ToRelativeCalendarOptions } from "luxon";

/**
 * Represents a value converter that formats a date as a localized, relative date string.
 * See the `Luxon` API docs for details.
 */
@autoinject
export class RelativeDateValueConverter
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
     * formatting the specified value as a localized, relative date string.
     * @param value The value to format.
     * @returns A localized string representing the value, relative to the current date.
     */
    public toView(value: DateTime | undefined | null): string | null | undefined
    {
        if (value == null)
        {
            return value;
        }

        const formatOptions: ToRelativeCalendarOptions =
        {
            locale: `${this._localeService.locale.code}-u-ca-iso8601`
        };

        return value.toRelativeCalendar(formatOptions);
    }
}
