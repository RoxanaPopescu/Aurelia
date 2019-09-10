/**
 * Namespace providing methods for generating random alpha-numeric IDs.
 * Note that this relies on the `Crypto` API provided by the platform.
 */
export namespace AlphaNumeric
{
    /**
     * Generates a random alpha-numeric ID.
     * @param length The desired length of the ID.
     * @returns A string representing the generated ID.
     */
    export function next(length: number): string
    {
        const values = new Uint8Array(length / 2);

        crypto.getRandomValues(values);

        return Array.from(values, getHexCode).join("");
    }

    /**
     * Gets the HEX code for the specified integer value.
     * @param value The integer value, in the range [0, 255].
     * @returns The HEX code, in the range ["00", "ff"].
     */
    function getHexCode(value: number): string
    {
        return (`0${value.toString(16)}`).substr(-2);
    }
}
