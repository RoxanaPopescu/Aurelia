/**
 * Represents a locale.
 */
export interface ILocale
{
    /**
     * The IETF language tag identifying the locale.
     * This value is case sensitive and consists of an ISO 639-1 language code,
     * optionally an ISO 15924 script code, and an ISO 3166-1 Alpha 2 country code.
     */
    code: string;

    /**
     * The IETF language tag extension, specifying the calendar, numbering system, etc.
     * This value is case sensitive and consists of the string "-u" followed by the extensions.
     */
    extension: string;

    /**
     * The name of the locale.
     */
    name: string;
}
