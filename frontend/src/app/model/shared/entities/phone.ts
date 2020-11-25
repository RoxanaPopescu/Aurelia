/**
 * Represents a phone
 */
export class PhoneNumber
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.countryCallingCode = data.countryCallingCode;

            if (data.countryCallingCode == null && data.countryPrefix)
            {
                this.countryCallingCode = data.countryPrefix;
            }

            if (data.countryCode)
            {
                this.countryCode = data.countryCode;
            }
            else
            {
                // TODO: Remove in later release
                this.countryCode = data.countryPrefix ? data.countryPrefix.replace(/\+|\s/g, "") : "";
            }

            if (data.nationalNumber)
            {
                this.nationalNumber = data.nationalNumber;
            }
            else
            {
                // TODO: Remove in later release
                this.nationalNumber = data.number;
            }

            // TODO: Remove legacy
            this.countryPrefix = this.countryCode;
            this.number = this.nationalNumber;
        }
    }

    /**
     * The ISO 3166-1 Alpha 2 country code identifying the country,
     * or undefined if not known, or if the phone number is non-geographic.
     * This value is case sensitive.
     */
    public countryCode?: string;

    /**
     * The country calling code, without the "+",
     * or undefined if not known.
     * Note that some countries share the same country calling code.
     */
    public countryCallingCode?: string;

    /**
     * The unformatted phone number, without the country calling code.
     */
    public nationalNumber: string;

    /**
     * Legacy properties. Before these can be removed we need to update
     * Route stop details
     * Driver add / edit
     */
    public countryPrefix?: string;
    public number: string;

    /**
     * True if the model is valid, otherwise false.
     */
    public get isValid(): boolean
    {
        return (/^(\s*\d\s*){8}$/.test(this.nationalNumber));
    }

    /**
     * The phone number formatted for presentation to a user,
     * including the country prefix.
     */
    public toString(): string
    {
        return this.countryPrefix ? `+${this.countryPrefix} ${this.number}` : this.number;
    }
}
