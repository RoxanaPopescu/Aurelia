import { autoinject } from "aurelia-framework";
import { LocaleService } from "../../services/locale";
import { DateTime, ToRelativeOptions } from "luxon";

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
        this.localeService = localeService;
    }

    private readonly localeService: LocaleService;

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

        const formatOptions: ToRelativeOptions =
        {
            locale: this.localeService.locale.code
        };

        return value.toRelativeCalendar(formatOptions);
    }
}
