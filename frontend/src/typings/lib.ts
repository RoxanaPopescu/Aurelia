// The following represent fixes for various platform types.

// tslint:disable

interface EventListenerOptions
{
    // Missing in lib.dom.d.ts
    once?: boolean;

    // Missing in lib.dom.d.ts
    passive?: boolean;
}

declare namespace Intl
{
    /**
     * Gets an array containing the canonical locale names.
     * Duplicates will be omitted and elements will be validated as structurally valid language tags.
     * @param localeCodes The locale code, or array of locale codes, for which to get the canonical locale codes.
     * @returns An array containing the canonical locale codes.
     */
    function getCanonicalLocales(localeCodes: string | string[]): string[];

    /**
     * Represents an object specifying options for language-sensitive plural form selection.
     */
    interface PluralFormatOptions
    {
        /**
         * The locale matching algorithm to use.
         * Possible values are `lookup` and `best fit`.
         * The default is `best fit`.
         */
        localeMatcher?: "lookup" | "best-fit";

        /**
         * The type to use. Possible values are:
         * `cardinal` for cardinal numbers (refering to the quantity of things). This is the default value.
         * `ordinal` for ordinal number (refering to the ordering or ranking of things, e.g. "1st", "2nd", "3rd" in English).
         */
        type?: "cardinal" | "ordinal";
    }

    /**
     * Represents an object specifying the resolved options for language-sensitive plural form selection.
     */
    interface ResolvedPluralFormatOptions extends PluralFormatOptions
    {
        /**
         * An array of plural categories used by the given language.
         */
        pluralCategories: string[];
    }

    /**
     * Represents an object that enable language-sensitive list formatting.
     */
    interface PluralFormat
    {
        select(number: number): string;
        resolvedOptions(): ResolvedPluralFormatOptions;
    }

    /**
     * The `Intl.PluralFormat` object is a constructor for objects that enable language-sensitive list formatting.
     */
    const PluralFormat:
    {
        new(locales?: string | string[], options?: PluralFormatOptions): PluralFormat;
        (locales?: string | string[], options?: PluralFormatOptions): PluralFormat;
        supportedLocalesOf(locales: string | string[], options?: PluralFormatOptions): string[];
    };

    /**
     * Represents an object specifying options for language-sensitive list formatting.
     */
    interface ListFormatOptions
    {
        /**
         * The locale matching algorithm to use.
         * Possible values are `lookup` and `best fit`.
         * The default is `best fit`.
         */
        localeMatcher?: "lookup" | "best-fit";

        /**
         * The length of the formated message.
         * Possible values are: `long` (default, e.g., A, B, and C); `short` or `narrow`(e.g., A, B,C).
         * When style is `narrow`, unit is the only allowed value for the `type` option.
         */
        style?: "narrow" | "short" | "long";

        /**
         * The format of output message.
         * Possible values are `conjunction` that stands for `and`-based lists (default, e.g., A, B, and C),
         * or `disjunction` that stands for `or`-based lists (e.g., A, B, or C). `unit` stands for lists of
         * values with units (e.g., 5 pounds, 12 ounces).
         */
        type?: "conjunction" | "disjunction" | "unit";
    }

    /**
     * Represents an object specifying the resolved options for language-sensitive list formatting.
     */
    interface ResolvedListFormatOptions extends ListFormatOptions
    {
    }

    /**
     * Represents an object that enable language-sensitive list formatting.
     */
    interface ListFormat
    {
        format(items: string[]): string;
        resolvedOptions(): ResolvedListFormatOptions;
    }

    /**
     * The `Intl.ListFormat` object is a constructor for objects that enable language-sensitive list formatting.
     */
    const ListFormat:
    {
        new(locales?: string | string[], options?: ListFormatOptions): ListFormat;
        (locales?: string | string[], options?: ListFormatOptions): ListFormat;
        supportedLocalesOf(locales: string | string[], options?: ListFormatOptions): string[];
    };
}
