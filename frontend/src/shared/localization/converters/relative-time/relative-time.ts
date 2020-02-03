import { autoinject } from "aurelia-framework";
import { DateTime, ToRelativeOptions, ToRelativeUnit } from "luxon";
import { LocaleService } from "../../services/locale";

/**
 * Represents a value converter that formats a date as a localized, relative time string.
 * See the `Luxon` API docs for details.
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

        const formatOptions: ToRelativeOptions =
        {
            locale: `${this._localeService.locale.code}-u-ca-iso8601`,
            unit,
            padding: padding != null ? padding : 100
        };

        return value.toRelative(formatOptions);
    }
}
