import { autoinject } from "aurelia-framework";
import { DateTime, LocaleOptions, DateTimeFormatOptions } from "luxon";
import { LocaleService } from "../../services/locale";

// The available formats.
const dateStyles =
{
    "narrow": DateTime.DATE_SHORT,
    "short": DateTime.DATE_MED,
    "medium": DateTime.DATE_FULL,
    "long": DateTime.DATE_HUGE
};

/**
 * Represents the supported date style values.
 */
export type DateStyle = keyof typeof dateStyles;

/**
 * Represents a value converter that formats a date as a localized date string.
 */
@autoinject
export class DateValueConverter
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
    public readonly signals = ["locale-changed"];

    /**
     * Converts the value for use in the view,
     * formatting the date component of the specified value as a localized date string, using the specified style.
     * @param value The value to format.
     * @param style The style to use. The default is `narrow`.
     * @param convert True to convert to the current time zone, otherwise false. The default is true.
     * @returns A localized string representing the value.
     */
    public toView(value: DateTime | undefined | null, style?: DateStyle, convert = true): string | null | undefined
    {
        if (value == null)
        {
            return value;
        }

        // Get the locale code, including the extension.
        const localeCodeWithExtension = `${this._localeService.locale.code}${this._localeService.locale.extension}`;

        const valueToFormat = convert ? value.toLocal() : value;

        const formatOptions: LocaleOptions & DateTimeFormatOptions =
        {
            ...dateStyles[style || "narrow"],
            locale: localeCodeWithExtension
        };

        return valueToFormat.toLocaleString(formatOptions);
    }
}
