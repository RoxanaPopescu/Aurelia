import { autoinject } from "aurelia-framework";
import { DateTime, LocaleOptions, DateTimeFormatOptions, Duration } from "luxon";
import { TimeOfDay } from "shared/types";
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
 * See the `Luxon` API docs for details.
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
     * Converts the value for use in the view,
     * formatting the time component of the specified value as a localized time string.
     * @param value The value to format.
     * @param style The style to use. The default is `narrow`.
     * @param convert True to convert to the current time zone, otherwise false. The default is true.
     * @returns A localized string representing the value.
     */
    public toView(value: DateTime | Duration | TimeOfDay | undefined | null, style?: TimeStyle, convert = true): string | null | undefined
    {
        if (value == null)
        {
            return value;
        }

        const valueToFormat =
            value instanceof Duration ? DateTime.local().startOf("day").plus(value) :
            value instanceof DateTime && convert ? value.toLocal() : value;

        const formatOptions: LocaleOptions & DateTimeFormatOptions =
        {
            ...timeStyles[style || "narrow"],
            locale: `${this._localeService.locale.code}-u-ca-iso8601`,
            hour12: false
        };

        return valueToFormat.toLocaleString(formatOptions);
    }
}
