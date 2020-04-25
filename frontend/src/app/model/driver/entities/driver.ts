import { PersonName, Phone } from "app/model/shared";
import { VehicleType } from "app/model/vehicle";
import { DriverStatus } from "./driver-status";

/**
 * Represents a driver, who makes the trip to fulfill the transportation of an order.
 */
export class Driver
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     * @param vehicleTypes The vehicle types associated with the driver, or undefined if unknown.
     */
    public constructor(data?: any, vehicleTypes?: VehicleType[])
    {
        if (data) {
            this.id = data.id;
            this.status = new DriverStatus(data.status);
            this.name = new PersonName(data.name);
            this.phone = new Phone(data.phone);
            this.email = data.email;
            this.pictureUrl = data.pictureUrl;
            this.vehicleTypes = vehicleTypes;
        } else {
            this.status = new DriverStatus("approved");
            this.name = new PersonName();
            this.phone = new Phone();
            this.phone.countryPrefix = "45";
        }

    }

    /**
     * The ID of the driver.
     */
    public id: number;

    /**
     * The status of the driver.
     */
    public status: DriverStatus;

    /**
     * The name of the driver.
     */
    public name: PersonName;

    /**
     * The email of the driver.
     */
    public email: string;

    /**
     * The phone number at which the driver can be contacted.
     */
    public phone: Phone;

    /**
     * The URL for the picture of the driver.
     */
    public pictureUrl: string;

    /**
     * The password of the driver, only used for when creating.
     */
    public password: string;

    /**
     * The vehicle types associated with the driver,
     * or undefined if unknown.
     */
    public vehicleTypes: VehicleType[] | undefined;
}
