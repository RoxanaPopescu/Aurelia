import { Phone } from "./phone";

/**
 * Represents an contact
 */
export class Contact
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            if (data.phoneNumber)
            {
                this.phoneNumber = new Phone(data.phoneNumber);
            }
            this.fullName = data.fullName;
            this.companyName = data.companyName;
            this.email = data.email;
        }
    }

    /**
     * The full name of the contact.
     */
    public fullName: string;

    /**
     * The name identifying the provider of the address.
     */
    public phoneNumber: Phone;

    /**
     * The name of the company.
     */
    public companyName: string;

    /**
     * The email.
     */
    public email: string;
}
