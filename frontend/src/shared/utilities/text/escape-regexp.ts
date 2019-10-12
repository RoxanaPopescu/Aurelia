/**
 * Escapes the specified text, so it can safely be used within a regular expression.
 * Note that this only supports ASCII characters.
 * @param text The text to escape.
 * @returns The escaped text.
 */
export function escapeRegExp(text: string): string
{
    // See: https://github.com/bergus/RegExp.escape/blob/master/EscapedChars.md
    return text.replace(/[\\^$*+?.()|[\]{}-]/g, "\\$&");
}
