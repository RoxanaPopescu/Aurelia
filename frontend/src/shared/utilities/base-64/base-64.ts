// Note: This is needed because the native `btoa` and `atob` functions doesn't handle Unicode characters correctly.
// See: https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem

/**
 * Namespace providing functions for Base64 encoding and decoding.
 */
export namespace Base64
{
    /**
     * Encodes a unicode string to a Base64 string.
     * @param text The string to encode.
     * @param unicode True to use URL encoding to handle Unicode characters, otherwise false.
     * @returns The encoded string.
     */
    export function encode(text: string, unicode = false): string
    {
        return unicode ?
            btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, ($0, $1)  => String.fromCharCode(`0x${$1}` as any))) :
            btoa(text);
    }

    /**
     * Decodes a Base64 string to a unicode string.
     * @param text The string to decode.
     * @param unicode True to use URL decoding to handle Unicode characters, otherwise false.
     * @returns The decoded string.
     */
    export function decode(text: string, unicode = false): string
    {
        return unicode ?
            decodeURIComponent(atob(text).split("").map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join("")) :
            atob(text);
    }
}
