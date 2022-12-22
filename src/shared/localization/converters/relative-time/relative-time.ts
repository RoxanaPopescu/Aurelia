import { autoinject } from "aurelia-framework";
import { DateTime, ToRelativeOptions, ToRelativeUnit } from "luxon";
import { LocaleService } from "../../services/locale";

/**
 * Represents a value converter that formats a date as a localized, relative time string.
 */
@autoinject
export class RelativeTimeValueConverter
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
     * formatting the specified value as a localized, relative time string.
     * @param value The value to format.
     * @param unit The unit to use. The default is choosen automatically based on the value.
     * @param padding The padding in milliseconds, used when determining when to round the result up or down. The default is 100.
     * @returns A localized string representing the value, relative to the current time.
     */
    public toView(value: DateTime | undefined | null, unit?: ToRelativeUnit, padding?: number): string | null | undefined
    {
        if (value == null)
        {
            return value;
        }

        // Get the locale code, including any unicode extension.
        const localeCodeWithExtension = this._localeService.locale.codeWithUnicodeExtension;

        const formatOptions: ToRelativeOptions =
        {
            locale: localeCodeWithExtension,
            unit,
            padding: padding != null ? padding : 100
        };

        return value.toRelative(formatOptions);
    }
}
