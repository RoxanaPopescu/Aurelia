import { autoinject } from "aurelia-framework";
import { DateTime, LocaleOptions, DateTimeFormatOptions } from "luxon";
import { LocaleService } from "../../services/locale";

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
     * The signals that should trigger a binding update.
     */
    public readonly signals = ["locale-changed"];

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

        // Get the locale code, including any unicode extension.
        const localeCodeWithExtension = this._localeService.locale.codeWithUnicodeExtension;

        const valueToFormat = convert ? value.toLocal() : value;

        const formatOptions: LocaleOptions & DateTimeFormatOptions =
        {
            ...dateTimeStyles[style || "narrow"],
            locale: localeCodeWithExtension,
            hour12: false
        };

        return valueToFormat.toLocaleString(formatOptions)

            // HACK: Fix common format errors in the browser locale data.
            // See: https://github.com/moment/luxon/issues/726#issuecomment-675151145
            .replace(/(^|\s)24:/, "$100:")
            .replace("24시", "0시");
    }
}
