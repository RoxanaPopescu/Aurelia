import { autoinject } from "aurelia-framework";
import { LocaleService } from "../../services/locale";

// The cache in which number formats will be stored.
const numberFormatCache = new Map<string, Intl.NumberFormat>();

/**
 * Represents a value converter that formats a number value as a localized number string.
 * See the `Intl.NumberFormat` API for details such as default values.
 */
@autoinject
export class NumberValueConverter
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
     * formatting the specified value as a localized number string with default number of fraction digits.
     * @param value The value to format.
     * @param useGrouping True to use grouping, false to not use grouping, or undefined to use the default.
     * @returns A localized string representing the value.
     */
    public toView(value: number | undefined | null, useGrouping?: boolean): string | null | undefined;

    /**
     * Converts the value for use in the view,
     * formatting the specified value as a localized number string with the specified number of fraction digits.
     * @param value The value to format.
     * @param fractionDigits The number of fraction digits to use, or undefined to use the default.
     * @param useGrouping True to use grouping, false to not use grouping, or undefined to use the default.
     * @returns A localized string representing the value.
     */
    public toView(value: number | undefined | null, fractionDigits: number | undefined, useGrouping?: boolean): string | null | undefined;

    /**
     * Converts the value for use in the view,
     * formatting the specified value as a localized number string with the specified number of fraction digits.
     * @param value The value to format.
     * @param minimumFractionDigits The minimum number of fraction digits to use, or undefined to use the default.
     * @param maximumFractionDigits The maximum number of fraction digits to use, or undefined to use the default.
     * @param useGrouping True to use grouping, false to not use grouping, or undefined to use the default.
     * @returns A localized string representing the value.
     */
    public toView(value: number | undefined | null, minimumFractionDigits: number | undefined, maximumFractionDigits: number | undefined, useGrouping?: boolean): string | null | undefined;

    public toView(...args: any[]): string | null | undefined
    {
        if (args[0] == null || isNaN(args[0]))
        {
            return args[0];
        }

        const numberFormat = this.getNumberFormat(this._localeService.locale.code,
        {
            style: "decimal",
            minimumFractionDigits: typeof args[1] === "number" ? args[1] : undefined,
            maximumFractionDigits: typeof args[2] === "number" ? args[2] : typeof args[1] === "number" ? args[1] : undefined,
            useGrouping: typeof args[args.length - 1] === "boolean" ? args[args.length - 1] : undefined
        });

        return numberFormat.format(args[0]);
    }

    /**
     * Gets or creates the specified number format.
     * @param localeCode The locale code to use.
     * @param options The options to use.
     * @returns The specified number format.
     */
    private getNumberFormat(localeCode: string, options: Intl.NumberFormatOptions): Intl.NumberFormat
    {
        const cacheKey = `${localeCode}|${JSON.stringify(options)}`;
        let numberFormat = numberFormatCache.get(cacheKey);

        if (numberFormat == null)
        {
            numberFormat = new Intl.NumberFormat(localeCode, options);
            numberFormatCache.set(cacheKey, numberFormat);
        }

        return numberFormat;
    }
}
