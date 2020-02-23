import { autoinject } from "aurelia-framework";
import { DateTime, ToRelativeCalendarOptions } from "luxon";
import { LocaleService } from "../../services/locale";

/**
 * Represents a value converter that formats a date as a localized, relative date string.
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
     * The signals that should trigger a binding update.
     */
    public readonly signals = ["locale-changed", "time-changed"];

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

        // Get the locale code, including the extension.
        const localeCodeWithExtension = `${this._localeService.locale.code}${this._localeService.locale.extension}`;

        const formatOptions: ToRelativeCalendarOptions =
        {
            locale: localeCodeWithExtension
        };

        return value.toRelativeCalendar(formatOptions);
    }
}
