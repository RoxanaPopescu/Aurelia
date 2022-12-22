// The following represent fixes for various platform types.

// tslint:disable

interface Navigator
{
    /**
     * Sets the notification badge for the app.
     * See: https://web.dev/badging-api
     * @param count The notification count to show in the badge, if any.
     */
    setAppBadge(count?: number): void;

    /**
     * Clears the notification badge for the app.
     * See: https://web.dev/badging-api
     */
    clearAppBadge(): void;
}

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
     * The Intl.supportedValuesOf() method returns an array containing the supported calendar,
     * collation, currency, numbering systems, or unit values supported by the implementation.
     * Duplicates are omitted and the array is sorted in ascending alphabetic order.
     * @param key A key string indicating the category of values to be returned.
     * Possible values are `calendar`, `collation`, `currency`,`numberingSystem`, `timeZone` and `unit`.
     * @returns A sorted array of unique string values indicating the values supported by the implementation for the given key.
     */
    function supportedValuesOf(key: string): string[];

    /**
     * Gets an array containing the canonical locale names.
     * Duplicates will be omitted and elements will be validated as structurally valid language tags.
     * @param localeCodes The locale code, or array of locale codes, for which to get the canonical locale codes.
     * @returns An array containing the canonical locale codes.
     */
    function getCanonicalLocales(localeCodes: string | string[]): string[];

    /**
     * Represents an object specifying options for language-sensitive list formatting.
     */
    interface ListFormatOptions
    {
        /**
         * The locale matching algorithm to use.
         * Possible values are `lookup` and `best fit` (default).
         */
        localeMatcher?: "lookup" | "best-fit";

        /**
         * The length of the formated message.
         * Possible values are: `long` (default, e.g. A, B, and C), `short` or `narrow` (e.g. A, B, C).
         * When style is `narrow`, the `type` option must be `unit`.
         */
        style?: "narrow" | "short" | "long";

        /**
         * The format of output message.
         * Possible values are `conjunction` (default, e.g. A, B, and C), `disjunction` (e.g. A, B, or C),
         * or `unit` (e.g. A, B, C).
         */
        type?: "conjunction" | "disjunction" | "unit";
    }

    /**
     * Represents an object specifying the resolved options for language-sensitive list formatting.
     */
    interface ResolvedListFormatOptions
    {
        /**
         * The locale to use.
         */
        locale: string;

        /**
         * The length of the formated message.
         * Possible values are: `long` (default, e.g. A, B, and C), `short` or `narrow` (e.g. A, B, C).
         * When style is `narrow`, unit is the only allowed value for the `type` option.
         */
        style: "narrow" | "short" | "long";

        /**
         * The format of output message.
         * Possible values are `conjunction` (default, e.g. A, B, and C), `disjunction` (e.g. A, B, or C),
         * or `unit` (e.g. A, B, C).
         */
        type: "conjunction" | "disjunction" | "unit";
    }

    /**
     * Represents an object that enables language-sensitive list formatting.
     */
    interface ListFormat
    {
        format(items: string[]): string;
        resolvedOptions(): ResolvedListFormatOptions;
    }

    /**
     * The `Intl.ListFormat` object is a constructor for objects that enables language-sensitive list formatting.
     */
    const ListFormat:
    {
        new(locales?: string | string[], options?: ListFormatOptions): ListFormat;
        supportedLocalesOf(locales: string | string[], options?: ListFormatOptions): string[];
    };

    /**
     * Represents an object specifying options for translation
     * of language, region, script and currency display names.
     */
    interface DisplayNamesOptions
    {
        /**
         * The locale matching algorithm to use.
         * Possible values are `lookup` and `best fit` (default).
         */
        localeMatcher?: "lookup" | "best-fit";

        /**
         * The length of the display names.
         * Possible values are: `long` (default, e.g. American English), `short` or `narrow` (e.g. US English).
         */
        style?: "narrow" | "short" | "long";

        /**
         * The type of the display names.
         * Possible values are `language` (default), `region`, `script` or `currency`.
         */
        type?: "language" | "region" | "script" | "currency";

        /**
         * The fallback strategy to use, if no localized name is available.
         * Possible values are `code` which means the code will be returned (default),
         * or `none` which means undefined will be returned.
         */
        fallback?: "code" | "none";
    }

    /**
     * Represents an object specifying the resolved options for translation
     * of language, region, script and currency display names.
     */
    interface ResolvedDisplayNamesOptions extends DisplayNamesOptions
    {
        /**
         * The locale to use.
         */
        locale: string;

        /**
         * The length of the display names.
         * Possible values are: `long` (default, e.g. American English), `short` or `narrow` (e.g. US English).
         */
        style: "narrow" | "short" | "long";

        /**
         * The type of the display names.
         * Possible values are `language` (default), `region`, `script` or `currency`.
         */
        type: "language" | "region" | "script" | "currency";

        /**
         * The fallback strategy to use, if no localized name is available.
         * Possible values are `code` which means the code will be returned (default),
         * or `none` which means undefined will be returned.
         */
        fallback: "code" | "none";
    }

    /**
     * Represents an object that enables the consistent translation of
     * language, region, script and currency display names.
     */
    interface DisplayNames
    {
        of(code: string): string | undefined;
        resolvedOptions(): ResolvedDisplayNamesOptions;
    }

    /**
     * The `Intl.DisplayNames` object is a constructor for objects that enables the consistent translation of
     * language, region, script and currency display names.
     */
    const DisplayNames:
    {
        new(locales?: string | string[], options?: DisplayNamesOptions): DisplayNames;
        supportedLocalesOf(locales: string | string[], options?: DisplayNamesOptions): string[];
    }
}
