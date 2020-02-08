import { autoinject } from "aurelia-framework";
import { LocaleService } from "../../services/locale";

// The cache in which number formats will be stored.
const listFormatCache = new Map<string, Intl.ListFormat>();

/**
 * The supported list style values.
 */
type ListStyle = "narrow" | "short" | "long";

/**
 * The supported list type values.
 */
type ListType = "conjunction" | "disjunction" | "unit";

/**
 * Represents a value converter that formats a sequence of items as a string representing a localized list.
 * See the `Intl.ListFormat` API for details.
 */
@autoinject
export class ListValueConverter
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
     * Converts a value for use in the View,
     * formatting the specified sequence of items as a localized list.
     * @param value The items to format as a list.
     * @param style The list style to use. The default is `long`.
     * @param type The type of list to produce. The default is `conjunction`.
     * @returns A localized string representing the sequence of items.
     */
    public toView(value: Iterable<any> | null | undefined, style: ListStyle, type: ListType): string | null | undefined
    {
        if (value == null)
        {
            return value;
        }

        const listFormat = this.getListFormat(this._localeService.locale.code,
        {
            style, type
        });

        const stringArray = value instanceof Array ? value : [...value].map(item => item.toString());

        return listFormat.format(stringArray);
    }

    /**
     * Gets or creates the specified list format.
     * @param localeCode The locale code to use.
     * @param options The options to use.
     * @returns The specified list format.
     */
    private getListFormat(localeCode: string, options: Intl.ListFormatOptions): Intl.ListFormat
    {
        const cacheKey = `${localeCode}|${JSON.stringify(options)}`;
        let listFormat = listFormatCache.get(cacheKey);

        if (listFormat == null)
        {
            listFormat = new Intl.ListFormat(localeCode, options);
            listFormatCache.set(cacheKey, listFormat);
        }

        return listFormat;
    }
}
