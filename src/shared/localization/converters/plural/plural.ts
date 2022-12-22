import { autoinject } from "aurelia-framework";
import { LocaleService } from "../../services/locale";

// The cache in which plural rules will be stored.
const pluralRulesCache = new Map<string, Intl.PluralRules>();

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
     * The signals that should trigger a binding update.
     */
    public readonly signals = ["locale-changed"];

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

        // Get the locale code, including any unicode extension.
        const localeCodeWithExtension = this._localeService.locale.codeWithUnicodeExtension;

        const pluralRules = this.getPluralRules(localeCodeWithExtension);
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
     * Gets or creates the specified plural rules.
     * @param localeCode The locale code to use.
     * @returns The specified plural rules.
     */
    private getPluralRules(localeCode: string): Intl.PluralRules
    {
        const cacheKey = `${localeCode}`;
        let pluralRules = pluralRulesCache.get(cacheKey);

        if (pluralRules == null)
        {
            pluralRules = new Intl.PluralRules(localeCode);
            pluralRulesCache.set(cacheKey, pluralRules);
        }

        return pluralRules;
    }
}
