import { Phone } from "./phone";
import { Name } from "./name";

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
            if (data.name)
            {
                this.name = new Name(data.name);
            }
            if (data.phoneNumber)
            {
                this.phoneNumber = new Phone(data.phoneNumber);
            }
            this.companyName = data.companyName;
        }
    }

    /**
     * The full name of the contact.
     */
    public name: Name;

    /**
     * The name identifying the provider of the address.
     */
    public phoneNumber: Phone;

    /**
     * The name of the company.
     */
    public companyName: string;
}
