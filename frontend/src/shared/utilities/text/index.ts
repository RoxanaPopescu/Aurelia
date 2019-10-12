import { TextSplitFuncs, TextSplitFunc } from "./text-split";
import { TextCaseFuncs, TextCaseFunc, TextCase } from "./text-case";

// Text cases which do not require the string to be split before the conversion.
const nonSeparatedTextCases = ["space", "upper", "lower", "sentence"];

// Text cases which use whitespace as separator.
const spaceSeparatedTextCases = ["space", "upper", "lower", "sentence", "title"];

/**
 * Converts the specified strings to a single string in the specified text case.
 * @param strings The strings to convert.
 * @param toTextCase The text case to which the text should be converted.
 * @param localized True to use the rules of the current locale when upper-casing or lower-casing, otherwise false. The default is false.
 * @param aggressive True to aggressively normalize casing and whitespace, false to apply only essential changes, leaving remaining characters unchanged.
 * The default is false, which means whitespace will be preserved or converted if possible, and no characters will be lower-cased when converting to
 * 'Title Case' or 'Sentence case', thus making those operations less invasive and more performant.
 * @returns The converted text.
 */
export function textCase(strings: string[], toCase: TextCase, localize?: boolean, nonInvasive?: boolean): string;

/**
 * Converts the specified text from the specified text case to the specified text case.
 * @param text The text to convert.
 * @param fromTextCase The text case from which the text should be converted.
 * @param toTextCase The text case to which the text should be converted.
 * @param localized True to use the rules of the current locale when upper-casing or lower-casing, otherwise false. The default is false.
 * @param aggressive True to aggressively normalize casing and whitespace, false to apply only essential changes, leaving remaining characters unchanged.
 * The default is false, which means whitespace will be preserved or converted if possible, and no characters will be lower-cased when converting to
 * 'Title Case' or 'Sentence case', thus making those operations less invasive and more performant.
 * @returns The converted text.
 */
export function textCase(text: string, fromCase: TextCase, toCase: TextCase, localize?: boolean, aggressive?: boolean): string;

export function textCase(...args: any[]): string
{
    const value = args[0];
    const fromTextCase = args[0] instanceof Array ? undefined : args[1];
    const toTextCase = args[0] instanceof Array ? args[1] : args[2];
    const localized = args[0] instanceof Array ? args[2] : args[3];
    const aggressive = args[0] instanceof Array ? args[3] : args[4];

    const textCaseFunc = (TextCaseFuncs as any)[`${toTextCase}Case`] as TextCaseFunc;

    if (textCaseFunc == null)
    {
        throw new Error(`The text case '${toTextCase}' is not supported.`);
    }

    let strings: string[];

    if (value instanceof Array)
    {
        strings = value;
    }
    else if (!aggressive && fromTextCase === "space" && nonSeparatedTextCases.includes(toTextCase))
    {
        strings = [value];
    }
    else if (!aggressive && fromTextCase === "space" && toTextCase === "title")
    {
        strings = textSplit(value, fromTextCase, true);
    }
    else
    {
        strings = textSplit(value, fromTextCase, !aggressive);
    }

    return textCaseFunc(strings, localized, aggressive);
}

/**
 * Splits the specified text into strings using the rules of a specific text case..
 * @param text The text to split.
 * @param preserveWhitespace True to also extract the whitespace, false to only extract strings.
 * @returns The strings extracted from the text.
 */
export function textSplit(text: string, fromTextCase: TextCase, preserveWhitespace = true): string[]
{
    const textSplitFunc = spaceSeparatedTextCases.includes(fromTextCase) ?
        TextSplitFuncs.spaceCase :
        (TextSplitFuncs as any)[`${fromTextCase}Case`] as TextSplitFunc;

    if (textSplitFunc == null)
    {
        throw new Error(`The text case '${fromTextCase}' is not supported.`);
    }

    return textSplitFunc(text, preserveWhitespace);
}

export { TextCase } from "./text-case";
export { textJoin } from "./text-join";
export { slugify } from "./slugify";
export { escapeHtml } from "./escape-html";
export { escapeRegExp } from "./escape-regexp";
