/**
 * Joins the specified strings using the specified separator, except if the previous string is all whitespace,
 * in which case each of those whitespace characters will be replaced with the separator instead.
 * @param strings The strings to join, which may be either words or whitespace.
 * @param separator The separator to use.
 * @returns The joined string.
 */
export function textJoin(strings: string[], separator: string): string
{
    const joined: string[] = [];

    strings.reduce((hasSpaceBefore, s, i) =>
    {
        const isWhitespace = /^\s*$/.test(s);

        if (!hasSpaceBefore && !isWhitespace)
        {
            joined.push(separator);
        }

        joined.push(isWhitespace ? separator.repeat(s.length) : s);

        return isWhitespace;
    },
    true);

    return joined.join("");
}
