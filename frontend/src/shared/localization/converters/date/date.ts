import { autoinject } from "aurelia-framework";
import { LocaleService } from "../../services/locale";
import { DateTime, LocaleOptions, DateTimeFormatOptions } from "luxon";

// The available formats.
const dateStyles =
{
    "narrow": { ...DateTime.DATE_SHORT, month: "2-digit", day: "2-digit" },
    "short": DateTime.DATE_MED,
    "long": DateTime.DATE_FULL,
    "full": DateTime.DATE_HUGE
};

/**
 * Represents the supported date style values.
 */
export type DateStyle = keyof typeof dateStyles;

/**
 * Represents a value converter that formats a date as a localized date string.
 * See the `Luxon` API docs for details.
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
        this.localeService = localeService;
    }

    private readonly localeService: LocaleService;

    /**
     * Converts the value for use in the view,
     * formatting the date component of the specified value as a localized date string, using the specified style.
     * @param value The value to format.
     * @param style The style to use. The default is `short`.
     * @param convert True to convert to the current time zone, otherwise false. The default is true.
     * @returns A localized string representing the value.
     */
    public toView(value: DateTime | undefined | null, style?: DateStyle, convert?: boolean): string | null | undefined
    {
        if (value == null)
        {
            return value;
        }

        const valueToFormat = convert === false ? value : value.toLocal();

        const formatOptions: LocaleOptions & DateTimeFormatOptions =
        {
            locale: this.localeService.locale.code,
            ...dateStyles[style || "short"]
        };

        return valueToFormat.toLocaleString(formatOptions);
    }
}
