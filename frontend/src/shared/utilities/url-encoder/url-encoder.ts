import { DateTime, Duration } from "luxon";

export class UrlEncoder
{
    /**
     * Encodes the specified path segment for use in a URL.
     * @param value The path segment to encode.
     * @returns The encoded path segment.
     */
    public encodePathSegment(value: any): string
    {
        return this.formatAndEncode(value, []);
    }

    /**
     * Encodes the specified query key for use in a URL.
     * @param value The key to encode.
     * @returns The encoded key.
     */
    public encodeQueryKey(value: any): string
    {
        return this.formatAndEncode(value, ["/", "?"]);
    }

    /**
     * Encodes the specified query value for use in a URL.
     * @param value The value to encode.
     * @returns The encoded value.
     */
    public encodeQueryValue(value: any): string
    {
        return this.formatAndEncode(value, ["/", "?"]);
    }

    /**
     * Encodes the specified hash for use in a URL.
     * @param value The hash to encode.
     * @returns The encoded hash.
     */
    public encodeHash(value: any): string
    {
        return this.formatAndEncode(value, ["/", "?", "&", "=", "#"]);
    }

    /**
     * Formats and encodes the specified value for use in a URL.
     * @param value The value to format and encode.
     * @param allow The substrings that should not be encoded, even though they normally would be.
     * @param isNested True if the value is nested, and therefore can't be complex, otherwise false.
     * @returns The encoded value.
     */
    private formatAndEncode(value: any, allow: string[], isNested?: boolean): string
    {
        // If the value is null or undefined, return an empty string.
        if (value == null)
        {
            return "";
        }

        // If the value is a `Date` instance, convert it to ISO 8601 format.
        if (value instanceof Date)
        {
            return value.toISOString();
        }

        // If the value is a `DateTime` instance, convert it to ISO 8601 format.
        if (value instanceof DateTime)
        {
            return value.toISO();
        }

        // If the value is a `Duration`instance, convert it to ISO 8601 format.
        if (value instanceof Duration)
        {
            return value.toISO();
        }

        if (!isNested)
        {
            // If the value is an `Array` instance, convert it to a comma-separated list of values.
            if (value instanceof Array)
            {
                return value.map(v => this.formatAndEncode(v, [...allow, ":"], true)).join(",");
            }

            // If the value is a `Set` instance, convert it to a comma-separated list of values.
            if (value instanceof Set)
            {
                return Array.from(value).map(v => this.formatAndEncode(v, [...allow, ":"], true)).join(",");
            }

            // If the value is a `Map` instance, convert it to a comma-separated list of `key:value` pairs.
            if (value instanceof Map)
            {
                return Array.from(value).map(([k, v]) => `${k}:${this.formatAndEncode(v, allow, true)}`).join(",");
            }

            // If the value is an `Object` instance, convert it to comma-separated list of `key:value` pairs.
            if (value instanceof Object)
            {
                return Object.keys(value).map(k => `${k}:${this.formatAndEncode(value[k], allow, true)}`).join(",");
            }

            // Convert the value to its default string representation, and encode it for use in a URL.
            return this.encode(value.toString(), [...allow, ",", ":"]);
        }

        // Convert the value to its default string representation, and encode it for use in a URL.
        return this.encode(value.toString(), [...allow]);
    }

    /**
     * Encodes the specified text for use in a URL.
     * @param text The text to encode.
     * @param allow The substrings that should not be encoded.
     * @returns The encoded text.
     */
    private encode(text: string, allow: string[]): string
    {
        let result = encodeURIComponent(text);

        for (const s of new Set(allow))
        {
            result = result.replaceAll(encodeURIComponent(s), s);
        }

        return result;
    }
}
