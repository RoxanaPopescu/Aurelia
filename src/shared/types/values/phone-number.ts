/**
 * Represents a phone number.
 */
export interface IPhoneNumber
{
    /**
     * The upper-case ISO 3166-1 Alpha 2 country code identifying the country,
     * or undefined if not known, or if the phone number is non-geographic.
     */
    countryCode?: string;

    /**
     * The country calling code, without the `+`, or undefined if not known.
     * Note that some countries share the same country calling code.
     */
    countryCallingCode?: string;

    /**
     * The unformatted phone number, without the country calling code.
     */
    nationalNumber: string;
}
