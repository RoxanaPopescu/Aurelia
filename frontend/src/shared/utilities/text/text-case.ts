import { textJoin } from "./text-join";

/**
 * Represents the text case formats a text may be converted to or from.
 */
export type TextCase = "space" | "upper" | "lower" | "sentence" | "title" | "pascal" | "camel" | "kebab" | "snake";

/**
 * Represents a function that formats and joins the specified strings using the rules of a specific text case.
 * @param strings The strings to join, which may be either words or whitespace.
 */
export type TextCaseFunc = (strings: string[], localized?: boolean, aggressive?: boolean) => string;

/**
 * Provides functions that format and join strings using the rules of a text case.
 */
export namespace TextCaseFuncs
{
    // tslint:disable: unnecessary-else

    /**
     * Formats and joins the specified strings using 'space case' rules,
     * meaning that no changes will be made to the strings.
     * The strings will then be joined using a single as separator, except if
     * the previous string is all whitespace, in which case no separator will be inserted.
     * @param strings The strings to join, which may be either words or whitespace.
     * @param localized True to use the rules of the current locale when upper-casing or lower-casing, otherwise false.
     * @returns The formatted and joined string.
     */
    export function spaceCase(strings: string[]): string
    {
        return textJoin(strings, " ");
    }

    /**
     * Formats and joins the specified strings using 'UPPER CASE' rules,
     * meaning that all characters will be upper-cased,
     * The strings will then be joined using a single space as separator, except if
     * the previous string is all whitespace, in which case no separator will be inserted.
     * @param strings The strings to join, which may be either a single string, words or whitespace.
     * @param localized True to use the rules of the current locale when upper-casing or lower-casing, otherwise false.
     * @returns The formatted and joined string.
     */
    export function upperCase(strings: string[], localized = false): string
    {
        if (localized)
        {
            return textJoin(strings.map(s => s.toLocaleUpperCase()), " ");
        }
        else
        {
            return textJoin(strings.map(s => s.toUpperCase()), " ");
        }
    }

    /**
     * Formats and joins the specified strings using 'lower case' rules,
     * meaning that all characters will be lower-cased.
     * The strings will then be joined using a single space as separator, except if
     * the previous string is all whitespace, in which case no separator will be inserted.
     * @param strings The strings to join, which may be either a single string, words or whitespace.
     * @param localized True to use the rules of the current locale when upper-casing or lower-casing, otherwise false.
     * @returns The formatted and joined string.
     */
    export function lowerCase(strings: string[], localized = false): string
    {
        if (localized)
        {
            return textJoin(strings.map(s => s.toLocaleLowerCase()), " ");
        }
        else
        {
            return textJoin(strings.map(s => s.toLowerCase()), " ");
        }
    }

    /**
     * Formats and joins the specified strings using 'Sentence case' rules,
     * meaning that the first letter of the first string will be upper-cased while all remaining characters will be either unchanged or lower-cased.
     * The strings will then be joined using a single space as separator, except if
     * the previous string is all whitespace, in which case no separator will be inserted.
     * @param strings The strings to join, which may be either a single string, words or whitespace.
     * @param localized True to use the rules of the current locale when upper-casing or lower-casing, otherwise false. The default is false.
     * @param aggressive True to both upper-case the first letter and lower-case the remaining characters, false to leave the remaining characters unchanged. The default is false.
     * @returns The formatted and joined string.
     */
    export function sentenceCase(strings: string[], localized = false, aggressive = false): string
    {
        if (aggressive)
        {
            const first = strings.slice(0, 1).map(s => upperCase([s.charAt(0)], localized) + s.slice(1));

            const rest = lowerCase(strings.slice(1), localized);

            return textJoin(first.concat(rest), " ");
        }
        else
        {
            const first = strings.slice(0, 1).map(s => upperCase([s.charAt(0)], localized) + s.slice(1));

            const rest = strings.slice(1);

            return textJoin(first.concat(rest), " ");
        }
    }

    /**
     * Formats and joins the specified strings using 'Title Case' rules,
     * meaning that the first letter of each string will be upper-cased while all remaining characters will be lower-cased.
     * The strings will then be joined using a single space as separator, except if
     * the previous string is all whitespace, in which case no separator will be inserted.
     * @param strings The strings to join, which may be either words or whitespace.
     * @param localized True to use the rules of the current locale when upper-casing or lower-casing, otherwise false.
     * @param aggressive True to both upper-case the first letter and lower-case the remaining characters, false to leave the remaining characters unchanged. The default is false.
     * @returns The formatted and joined string.
     */
    export function titleCase(strings: string[], localized = false, aggressive = false): string
    {
        if (aggressive)
        {
            const all = strings.map(s => upperCase([s.charAt(0)], localized) + lowerCase([s.slice(1)], localized));

            return textJoin(all, " ");
        }
        else
        {
            const all = strings.map(s => upperCase([s.charAt(0)], localized) + s.slice(1));

            return textJoin(all, " ");
        }
    }

    /**
     * Formats and joins the specified strings using 'PascalCase' rules,
     * meaning that the first letter of each string will be upper-cased while all remaining characters will be lower-cased.
     * The strings will then be joined.
     * @param strings The strings to join, which may be either words or whitespace.
     * @param localized True to use the rules of the current locale when upper-casing or lower-casing, otherwise false.
     * @returns The formatted and joined string.
     */
    export function pascalCase(strings: string[], localized = false): string
    {
        const filtered = strings.filter(s => !/^\s*$/.test(s));

        return filtered.map(s => upperCase([s.charAt(0)], localized) + lowerCase([s.slice(1)], localized)).join("");
    }

    /**
     * Formats and joins the specified strings using 'camelCase' rules,
     * meaning that the first letter of each string, except the first, will be upper-cased while all remaining characters of each will be lower-cased.
     * The strings will then be joined.
     * @param strings The strings to join, which may be either words or whitespace.
     * @param localized True to use the rules of the current locale when upper-casing or lower-casing, otherwise false.
     * @returns The formatted and joined string.
     */
    export function camelCase(strings: string[], localized = false): string
    {
        const filtered = strings.filter(s => !/^\s*$/.test(s));

        const first = lowerCase(filtered.slice(0, 1), localized);

        const rest = filtered.slice(1).map(s => upperCase([s.charAt(0)], localized) + lowerCase([s.slice(1)], localized));

        return [first].concat(rest).join("");
    }

    /**
     * Formats and joins the specified strings using 'kebab-case' rules,
     * meaning that each string will be lower cased.
     * The strings will then be joined using "-" as separator, except if the previous string is all whitespace,
     * in which case each of those whitespace characters will be replaced with the separator instead.
     * @param strings The strings to join, which may be either words or whitespace.
     * @param localized True to use the rules of the current locale when upper-casing or lower-casing, otherwise false.
     * @returns The formatted and joined string.
     */
    export function kebabCase(strings: string[], localized = false): string
    {
        return textJoin(strings.map(s => lowerCase([s], localized), localized), "-");
    }

    /**
     * Formats and joins the specified strings using 'snake_case' rules,
     * meaning that each string will be lower cased.
     * The strings will then be joined using "_" as separator, except if the previous string is all whitespace,
     * in which case each of those whitespace characters will be replaced with the separator instead.
     * @param strings The strings to join, which may be either words or whitespace.
     * @param localized True to use the rules of the current locale when upper-casing or lower-casing, otherwise false.
     * @returns The formatted and joined string.
     */
    export function snakeCase(strings: string[], localized = false): string
    {
        return textJoin(strings.map(s => lowerCase([s], localized), localized), "_");
    }

    // tslint:enable
}
