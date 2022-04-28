import { EntityInfo } from "app/types/entity";
import { PersonName, PhoneNumber } from "app/model/shared";
import { DriverStatus } from "./driver-status";

/**
 * Represents info about a driver.
 */
export class DriverInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data)
        {
            this.id = data.id?.toString();
            this.status = new DriverStatus(data.status);
            this.name = new PersonName(data.name);
            this.phone = new PhoneNumber(data.phone);
            this.pictureUrl = data.pictureUrl;
        }
    }

    /**
     * The ID of the driver.
     */
    public id: string;

    /**
     * The status of the driver.
     */
    public status: DriverStatus;

    /**
     * The name of the driver.
     */
    public name: PersonName;

    /**
     * The phone number at which the driver can be contacted.
     */
    public phone: PhoneNumber;

    /**
     * The URL for the picture of the driver.
     */
    public pictureUrl: string;

    /**
     * Gets the strinbg representation of this instance.
     */
    public toString(): string
    {
        return `${this.name.toString()} (${this.id})`;
    }

    /**
     * Gets an `EntityInfo` instance representing this instance.
     */
    public toEntityInfo(): EntityInfo
    {
        return new EntityInfo(
        {
            type: "driver",
            id: this.id,
            name: `${this.name?.first ?? ""} ${this.name?.last ?? ""}`.trim() ?? this.id
        });
    }
}
