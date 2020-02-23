import { autoinject } from "aurelia-framework";
import { LocaleService } from "../../services/locale";
import { ICurrencyValue } from "shared/types";
import { roundNumber } from "shared/utilities";

// The cache in which number formats will be stored.
const numberFormatCache = new Map<string, Intl.NumberFormat>();

/**
 * The supported currency display values.
 */
type CurrencyDisplay = "symbol" | "code" | "name" | "none";

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
     * The signals that should trigger a binding update.
     */
    public readonly signals = ["locale-changed"];

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

        if (args[0].currencyCode == null || args[0].amount == null || isNaN(args[0].amount))
        {
            throw new Error("Invalid currency value.");
        }

        // Define the formatting options.
        const numberFormatOptions =
        {
            style: "currency",
            currency: args[0].currencyCode,
            currencyDisplay:
                typeof args[3] === "string"  && args[3] !== "none" ? args[3] :
                typeof args[2] === "string" && args[2] !== "none" ? args[2] :
                typeof args[1] === "string" && args[1] !== "none" && args[1] !== "auto" ? args[1] :
                undefined
        };

        // Get the locale code, including the extension.
        const localeCodeWithExtension = `${this._localeService.locale.code}${this._localeService.locale.extension}`;

        // Create the format, based on what we know so far.
        // Note that this may not be the format we actually end up using,
        // but we need it to resolve the min and max fraction digits.
        let numberFormat = this.getNumberFormat(localeCodeWithExtension,
        {
            ...numberFormatOptions,

            minimumFractionDigits:
                typeof args[1] === "number" ? args[1] :
                undefined,

            maximumFractionDigits:
                typeof args[2] === "number" ? args[2] :
                typeof args[1] === "number" ? args[1] :
                undefined
        });

        // If we should format the number without any currency info,
        // change the formatting style to `decimal`.
        if (args[args.length - 1] === "none")
        {
            numberFormatOptions.style = "decimal";
        }

        // Should we only show the fraction if it is non-zero?
        if (args[1] === "auto")
        {
            // Get the resolved format options.
            const resolvedOptions = numberFormat.resolvedOptions();

            // Round the amount to the resolved max fraction digits.
            const roundedAmount = roundNumber(args[0].amount, resolvedOptions.maximumFractionDigits);

            // Do we have a non-zero fraction?
            if (roundedAmount % 1 !== 0)
            {
                // Create a new format with the resolved max fraction digits.
                numberFormat = this.getNumberFormat(localeCodeWithExtension,
                {
                    ...numberFormatOptions,
                    maximumFractionDigits: resolvedOptions.maximumFractionDigits
                });
            }
            else
            {
                // Create a new format with zero min fraction digits.
                numberFormat = this.getNumberFormat(localeCodeWithExtension,
                {
                    ...numberFormatOptions,
                    minimumFractionDigits: 0
                });
            }
        }

        // Was the formatting style changed?
        else if (args[1] === "none")
        {
            // Create a new format with the modified style.
            numberFormat = this.getNumberFormat(localeCodeWithExtension, numberFormatOptions);
        }

        // Format the value.
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
