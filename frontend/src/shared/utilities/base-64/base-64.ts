// Note: This is needed because the native `btoa` and `atob` functions doesn't handle Unicode characters correctly.
// See: https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem

/**
 * Namespace providing functions for Base64 encoding and decoding.
 */
export namespace Base64
{
    /**
     * Encodes a string using Base64.
     * @param string The string to encode.
     * @param unicode True if the string may contain Unicode characters, otherwise false.
     * @param url True to use the URL-safe alphabet, otherwise false.
     * @param padded True to use padding, otherwise false.
     * @returns The encoded string.
     */
    export function encode(string: string, unicode = false, url = false, padded = true): string
    {
        let result = unicode ?
            btoa(encodeURIComponent(string).replace(/%([0-9A-F]{2})/g, ($0, $1) => String.fromCharCode(`0x${$1}` as any))) :
            btoa(string);

        if (url)
        {
            result = result.replace(/\+/g, "-").replace(/\//g, "_");
        }

        if (!padded)
        {
            result = result.replace(/=/g, "");
        }

        return result;
    }

    /**
     * Decodes a string using Base64.
     * @param string The string to decode.
     * @param unicode True if the string may contain Unicode characters, otherwise false.
     * @param url True to use the URL-safe alphabet, otherwise false.
     * @param padded True if padding is used, otherwise false.
     * @returns The decoded string.
     */
    export function decode(string: string, unicode = false, url = false, padded = true): string
    {
        if (url)
        {
            // tslint:disable: no-parameter-reassignment

            string = string.replace(/-/g, "+").replace(/_/g, "/");
        }

        if (!padded)
        {
            switch (string.length % 4)
            {
                case 0:
                    break;
                case 2:
                    string += "==";
                    break;
                case 3:
                    string += "=";
                    break;
                default:
                    throw new Error("Invalid Base64URL string");
            }

            // tslint:enable
        }

        return unicode ?
            decodeURIComponent(atob(string).split("").map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join("")) :
            atob(string);
    }
}
