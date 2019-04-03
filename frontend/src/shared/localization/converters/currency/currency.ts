import { autoinject } from "aurelia-framework";
import { LocaleService } from "../../services/locale";
import { ICurrencyValue } from "../../../types/values/currency-value";
import { roundNumber } from "../../../utilities";

// The cache in which number formats will be stored.
const numberFormatCache = new Map<string, Intl.NumberFormat>();

/**
 * The supported currency display values.
 */
type CurrencyDisplay = "symbol" | "code" | "name";

/**
 * Represents a value converter that formats a number value as a localized currency string.
 * See the `Intl.NumberFormat` API for details such as default values.
 */
@autoinject
export class CurrencyValueConverter
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
     * formatting the specified value as a localized currency string with default number of fraction digits.
     * @param value The currency value to format.
     * @param currencyDisplay The dispaly format to use. The default is `symbol`.
     * @returns A localized string representing the value.
     */
    public toView(value: ICurrencyValue | undefined | null, currencyDisplay?: CurrencyDisplay): string | null | undefined;

    /**
     * Converts the value for use in the view,
     * formatting the specified value as a localized currency string with the specified number of fraction digits.
     * @param value The currency value to format.
     * @param fractionDigits The number of fraction digits to use, `auto` to choose automatically, or undefined to use the default.
     * @param currencyDisplay The dispaly format to use. The default is `symbol`.
     * @returns A localized string representing the value.
     */
    public toView(value: ICurrencyValue | undefined | null, fractionDigits: "auto" | number | undefined, currencyDisplay?: CurrencyDisplay): string | null | undefined;

    /**
     * Converts the value for use in the view,
     * formatting the specified value as a localized currency string with the specified number of fraction digits.
     * @param value The currency value to format.
     * @param minimumFractionDigits The minimum number of fraction digits to use, `auto` to choose automatically, or undefined to use the default.
     * @param maximumFractionDigits The maximum number of fraction digits to use, or undefined to use the default.
     * @param currencyDisplay The dispaly format to use. The default is `symbol`.
     * @returns A localized string representing the value.
     */
    public toView(value: ICurrencyValue | undefined | null, minimumFractionDigits: "auto" | number | undefined, maximumFractionDigits: number | undefined, currencyDisplay?: CurrencyDisplay): string | null | undefined;

    public toView(...args: any[]): string | null | undefined
    {
        if (args[0] == null)
        {
            return args[0];
        }

        if (args[0].currencyCode == null || args[0].amount == null)
        {
            throw new Error("Invalid currency value.");
        }

        const autoFractionDigits = args[1] === "auto";

        const numberFormatOptions =
        {
            style: "currency",
            currency: args[0].currencyCode,
            currencyDisplay: args.length > 1 ? args[args.length - 1] : undefined
        };

        let numberFormat = this.getNumberFormat(this._localeService.locale.code,
        {
            ...numberFormatOptions,
            minimumFractionDigits: autoFractionDigits ? args[1] : undefined,
            maximumFractionDigits: args.length > 2 ? args[2] : args[1]
        });

        if (autoFractionDigits)
        {
            const resolvedOptions = numberFormat.resolvedOptions();
            const roundedAmount = roundNumber(args[0].amount, resolvedOptions.maximumFractionDigits);

            if (roundedAmount % 1 === 0)
            {
                numberFormat = this.getNumberFormat(this._localeService.locale.code,
                {
                    ...numberFormatOptions,
                    minimumFractionDigits: 0
                });
            }
            else
            {
                numberFormat = this.getNumberFormat(this._localeService.locale.code,
                {
                    ...numberFormatOptions,
                    maximumFractionDigits: resolvedOptions.maximumFractionDigits
                });
            }
        }

        return numberFormat.format(args[0].amount);
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
