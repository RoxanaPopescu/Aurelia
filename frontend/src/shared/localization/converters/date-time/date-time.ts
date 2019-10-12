import { autoinject } from "aurelia-framework";
import { LocaleService } from "../../services/locale";
import { DateTime, LocaleOptions, DateTimeFormatOptions } from "luxon";

// The available formats.
const dateTimeStyles =
{
    "narrow": DateTime.DATETIME_SHORT,
    "short": DateTime.DATETIME_MED,
    "medium": DateTime.DATETIME_FULL,
    "long": DateTime.DATETIME_HUGE
};

/**
 * Represents the supported date-time style values.
 */
export type DateTimeStyle = keyof typeof dateTimeStyles;

/**
 * Represents a value converter that formats a date and time value as a localized date and time string.
 * See the `Luxon` API docs for details.
 */
@autoinject
export class DateTimeValueConverter
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
     * formatting the specified value as a localized date and time string, using the specified style.
     * @param value The value to format.
     * @param style The style to use. The default is `narrow`.
     * @param convert True to convert to the current time zone, otherwise false. The default is true.
     * @returns A localized string representing the value.
     */
    public toView(value: DateTime | undefined | null, style?: DateTimeStyle, convert = true): string | null | undefined
    {
        if (value == null)
        {
            return value;
        }

        const valueToFormat = convert ? value.toLocal() : value;

        const formatOptions: LocaleOptions & DateTimeFormatOptions =
        {
            ...dateTimeStyles[style || "narrow"],
            locale: `${this._localeService.locale.code}-u-ca-iso8601`,
            hour12: false
        };

        return valueToFormat.toLocaleString(formatOptions);
    }
}
