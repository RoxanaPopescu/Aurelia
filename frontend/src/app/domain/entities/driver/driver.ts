import { PersonName, Phone } from "app/domain/entities/shared";

/**
 * Represents a driver, who makes the trip to fulfill the transportation of an order.
 */
export class Driver
{
    public constructor(data: any)
    {
        this.id = data.id;
        this.name = new PersonName(data.name);
        this.phone = new Phone(data.phone);
        this.pictureUrl = data.pictureUrl;
    }

    /**
     * The ID of the driver.
     */
    public id: number;

    /**
     * The name of the driver.
     */
    public name: PersonName;

    /**
     * The phone number at which the driver can be contacted.
     */
    public phone: Phone;

    /**
     * The URL for the picture of the driver.
     */
    public pictureUrl: string;
}
