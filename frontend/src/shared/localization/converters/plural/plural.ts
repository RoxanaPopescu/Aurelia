import { autoinject } from "aurelia-framework";
import { LocaleService } from "../../services/locale";

// The cache in which number formats will be stored.
const pluralFormatCache = new Map<string, Intl.PluralFormat>();

/**
 * Represents a value converter that selects the appropiate form of a string, based on the plural category of a number.
 */
@autoinject
export class PluralValueConverter
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
     * selecting the appropiate form of the specified string, based on the plural category of the specified number.
     * @param value The number for which the plural category will be determined.
     * @param strings The plural forms of the string, listed in the order specified for the locale.
     * @returns The appropiate form of the string.
     */
    public toView(value: number | null | undefined, ...strings: string[]): string | null | undefined
    {
        if (value == null)
        {
            return value;
        }

        const pluralRules = this.getPluralFormat(this._localeService.locale.code);
        const pluralCategories = pluralRules.resolvedOptions().pluralCategories;

        if (strings.length !== pluralCategories.length)
        {
            throw new Error("The number of arguments do not match the number of plural forms for the current locale.");
        }

        const pluralCategory = pluralRules.select(value);
        const pluralCategoryIndex = pluralCategories.indexOf(pluralCategory);

        return strings[pluralCategoryIndex];
    }

    /**
     * Gets or creates the specified plural format.
     * @param localeCode The locale code to use.
     * @returns The specified plural format.
     */
    private getPluralFormat(localeCode: string): Intl.PluralFormat
    {
        const cacheKey = `${localeCode}`;
        let pluralFormat = pluralFormatCache.get(cacheKey);

        if (pluralFormat == null)
        {
            pluralFormat = new Intl.PluralFormat(localeCode);
            pluralFormatCache.set(cacheKey, pluralFormat);
        }

        return pluralFormat;
    }
}
