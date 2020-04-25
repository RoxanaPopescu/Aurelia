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
    public constructor(data: any, vehicleTypes?: VehicleType[])
    {
        this.id = data.id;
        this.status = new DriverStatus(data.status);
        this.name = new PersonName(data.name);
        this.phone = new Phone(data.phone);
        this.pictureUrl = data.pictureUrl;
        this.vehicleTypes = vehicleTypes;
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
     * The phone number at which the driver can be contacted.
     */
    public phone: Phone;

    /**
     * The URL for the picture of the driver.
     */
    public pictureUrl: string;

    /**
     * The vehicle types associated with the driver,
     * or undefined if unknown.
     */
    public vehicleTypes: VehicleType[] | undefined;
}
