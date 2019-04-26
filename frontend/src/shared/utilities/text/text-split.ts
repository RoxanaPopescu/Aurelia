/**
 * Represents a function that splits the specified text into strings using the rules of a specific text case.
 * @param text The text to split.
 * @param preserveWhitespace True to also extract whitespace between strings, false to only extract strings.
 * @returns The strings extracted from the text.
 */
export type TextSplitFunc = (text: string, preserveWhitespace: boolean) => string[];

/**
 * Provides functions that splits a text into strings using the rules of a text case.
 */
export namespace TextSplitFuncs
{
    /**
     * Splits the specified text using 'PascalCase' rules,
     * meaning that the text will be split on every upper-case letter.
     * Note that this only supports ASCII characters.
     * @param text The text to split.
     * @returns The strings extracted from the text.
     */
    export function pascalCase(text: string): string[]
    {
        return text.split(/([A-Z][^A-Z]*)/g).filter(s => s);
    }

    /**
     * Splits the specified text using 'camelCase' rules,
     * meaning that the text will be split on every upper-case letter.
     * Note that this only supports ASCII characters.
     * @param text The text to split.
     * @returns The strings extracted from the text.
     */
    export function camelCase(text: string): string[]
    {
        return text.split(/([A-Z][^A-Z]*)/g).filter(s => s);
    }

    /**
     * Splits the specified text using 'kebab-case' rules,
     * meaning that the text will be split when one or more "-" characters are encountered.
     * @param text The text to split.
     * @param preserveWhitespace True to also extract the separators as whitespace, false to only extract words.
     * @returns The strings extracted from the text.
     */
    export function kebabCase(text: string, preserveWhitespace: boolean): string[]
    {
        return (preserveWhitespace ? text.replace(/-/g, " ").split(/(\s+)/g) : text.split(/-+/g)).filter(s => s);
    }

    /**
     * Splits the specified text using 'snake_case' rules,
     * meaning that the text will be split when one or more "_" characters are encountered.
     * @param text The text to split.
     * @param preserveWhitespace True to also extract the separators as whitespace, false to only extract words.
     * @returns The strings extracted from the text.
     */
    export function snakeCase(text: string, preserveWhitespace: boolean): string[]
    {
        return (preserveWhitespace ? text.replace(/_/g, " ").split(/(\s+)/g) : text.split(/_+/g)).filter(s => s);
    }

    /**
     * Splits the specified text using 'space case' rules,
     * meaning that the text will be split when one or more whitespace characters are encountered.
     * @param text The text to split.
     * @param preserveWhitespace True to also extract the whitespace, false to only extract words.
     * @returns The strings extracted from the text.
     */
    export function spaceCase(text: string, preserveWhitespace: boolean): string[]
    {
        return (preserveWhitespace ? text.split(/(\s+)/g) : text.split(/\s+/g)).filter(s => s);
    }
}
