import { textCase, TextCase } from "shared/utilities";

/**
 * Represents a value converter that converts a string from one text case to another.
 */
export class CaseValueConverter
{
    /**
     * Converts the specified strings into a single string in the specified text case.
     * @param value The strings to convert.
     * @param toTextCase The text case to which the text should be converted.
     * @param localized True to use the rules of the current locale when upper-casing or lower-casing, otherwise false. The default is false.
     * @param aggressive True to aggressively normalize casing and whitespace, false to apply only essential changes, leaving remaining characters unchanged.
     * The default is false, which means whitespace will be preserved or converted if possible, and no characters will be lower-cased when converting to
     * 'Title Case' or 'Sentence case', thus making those operations less invasive and more performant.
     * @returns The converted text.
     */
    public toView(value: string[], toTextCase: TextCase, localized?: boolean, aggressive?: boolean): string;

    /**
     * Converts the specified space-separated text to the specified text case.
     * @param value The space-separated text to convert.
     * @param toTextCase The text case to which the text should be converted.
     * @param localized True to use the rules of the current locale when upper-casing or lower-casing, otherwise false. The default is false.
     * @param aggressive True to aggressively normalize casing and whitespace, false to apply only essential changes, leaving remaining characters unchanged.
     * The default is false, which means whitespace will be preserved or converted if possible, and no characters will be lower-cased when converting to
     * 'Title Case' or 'Sentence case', thus making those operations less invasive and more performant.
     * @returns The converted text.
     */
    public toView(value: string, toTextCase: TextCase, localized?: boolean, aggressive?: boolean): string;

    /**
     * Converts the specified text from the specified text case to the specified text case.
     * @param value The text to convert.
     * @param fromTextCase The text case from which the text should be converted.
     * @param toTextCase The text case to which the text should be converted.
     * @param localized True to use the rules of the current locale when upper-casing or lower-casing, otherwise false. The default is false.
     * @param aggressive True to aggressively normalize casing and whitespace, false to apply only essential changes, leaving remaining characters unchanged.
     * The default is false, which means whitespace will be preserved or converted if possible, and no characters will be lower-cased when converting to
     * 'Title Case' or 'Sentence case', thus making those operations less invasive and more performant.
     * @returns The converted text.
     */
    public toView(value: string, fromTextCase: TextCase, toTextCase: TextCase, localized?: boolean, aggressive?: boolean): string;

    public toView(...args: any[]): string
    {
        if (args[0] == null)
        {
            return args[0];
        }

        if (typeof args[0] === "string" && typeof args[2] !== "string")
        {
            return this.toView(args[0], "space", args[1], args[2], args[3]);
        }

        return textCase.apply(null, args);
    }
}
