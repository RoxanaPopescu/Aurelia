import { Base64 } from "../../../shared/utilities";

// This is a simple implementation of an obfuscator and deobfuscator for use in API protection.
// This is obviously not intended to provide any real security, but simply attempts to obscure
// things enough, that the casual observer will not be immediately tempted to abuse the services.
//
// The approach taken here, is to combine Unicode-safe Base64 encoding with a Substitution Cipher.
// This ensures the ciphertext is URL-safe, impedes the recognition of the encoding being used,
// and prevents decoding by simply copying and pasting the ciphertext into any Base64 decoder.
//
// For more info, see:
// https://en.wikipedia.org/wiki/Base64
// https://en.wikipedia.org/wiki/Substitution_cipher

const base64Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

/**
 * Obfuscates the specified string by encoding it as Base64 and then encrypting it using a Caesar Cipher.
 * @param plaintext The text that should be obfuscated.
 * @param cipherAlphabet The cipher alphabet to use.
 * @returns The obfuscated text.
 */
export function obfuscate(plaintext: string, cipherAlphabet: string): string
{
    const cipherChars: string[] = [];

    for (const char of Base64.encode(plaintext, true))
    {
        cipherChars.push(cipherAlphabet[base64Alphabet.indexOf(char)]);
    }

    return cipherChars.join("");
}

/**
 * Deobfuscates the specified string by decrypting it using a Caesar Cipher and then decoding it as Base64.
 * @param ciphertext The text that should be deobfuscated.
 * @param cipherAlphabet The cipher alphabet to use.
 * @returns The deobfuscated text.
 */
export function deobfuscate(ciphertext: string, cipherAlphabet: string): string
{
    const base64Chars: string[] = [];

    for (const char of ciphertext)
    {
        base64Chars.push(base64Alphabet[cipherAlphabet.indexOf(char)]);
    }

    return Base64.decode(base64Chars.join(""), true);
}
