import { autoinject } from "aurelia-framework";
import { IPhoneNumber } from "shared/types";

// tslint:disable-next-line: no-submodule-imports
import { parsePhoneNumber } from "libphonenumber-js/min";

/**
 * Represents the supported phone number style values.
 */
export type PhoneStyle = "national" | "international" | "e.164" | "rfc3966" | "idd";

/**
 * Represents a value converter that formats a phone number according to its country.
 */
@autoinject
export class PhoneValueConverter
{
    /**
     * Converts the value for use in the view,
     * formatting the value as a phone number, with or without the country calling code.
     * @param value The value to format.
     * @param style The style to use. The default is `international`.
     * @returns A string representing the formatted phone number.
     */
    public toView(value: IPhoneNumber | string | undefined | null, style: PhoneStyle = "international"): string | null | undefined
    {
        if (value == null)
        {
            return value;
        }

        let valueToFormat: string;

        if (typeof value === "string")
        {
            valueToFormat = value;
        }
        else
        {
            valueToFormat = "";

            if (value.countryCallingCode)
            {
                valueToFormat += `+${value.countryCallingCode} `;
            }

            if (value.nationalNumber)
            {
                valueToFormat += value.nationalNumber;
            }
        }

        try
        {
            const phoneNumber = parsePhoneNumber(valueToFormat, (value as any).countryCode);

            return phoneNumber.format(style.toUpperCase() as any);
        }
        catch (error)
        {
            console.error(error);

            return style === "rfc3966" ? `tel:${valueToFormat}`: valueToFormat;
        }
    }
}
