import { autoinject } from "aurelia-framework";
import { DateTime, LocaleOptions, DateTimeFormatOptions, Duration } from "luxon";
import { LocaleService } from "../../services/locale";

// The available formats.
const timeStyles =
{
    "narrow": DateTime.TIME_SIMPLE,
    "short": DateTime.TIME_WITH_SECONDS,
    "medium": DateTime.TIME_WITH_SHORT_OFFSET,
    "long": DateTime.TIME_WITH_LONG_OFFSET
};

/**
 * Represents the supported time style values.
 */
export type TimeStyle = keyof typeof timeStyles;

/**
 * Represents a value converter that formats a date as a localized date string.
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
     * The signals that should trigger a binding update.
     */
    public readonly signals = ["locale-changed"];

    /**
     * Converts the value for use in the view,
     * formatting the time component of the specified value as a localized time string.
     * @param value The value to format.
     * @param style The style to use. The default is `narrow`.
     * @param convert True to convert to the current time zone, otherwise false. The default is true.
     * @returns A localized string representing the value.
     */
    public toView(value: DateTime | Duration | undefined | null, style?: TimeStyle, convert = true): string | null | undefined
    {
        if (value == null)
        {
            return value;
        }

        // Get the locale code, including any unicode extension.
        const localeCodeWithExtension = this._localeService.locale.codeWithUnicodeExtension;

        const valueToFormat =
            value instanceof Duration ? DateTime.utc().startOf("day").plus(value) :
            value instanceof DateTime && convert ? value.toLocal() : value;

        const formatOptions: DateTimeFormatOptions =
        {
            ...timeStyles[style || "narrow"],
            hour12: false
        };

        const localeOptions: LocaleOptions =
        {
            locale: localeCodeWithExtension
        };

        return valueToFormat.toLocaleString(formatOptions, localeOptions)

            // HACK: Fix common format errors in the browser locale data.
            .replace(/(^|\s)24:/, "$100:")
            .replace("24???", "0???");
    }
}
