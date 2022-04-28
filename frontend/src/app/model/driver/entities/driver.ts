import { PersonName, PhoneNumber, Position } from "app/model/shared";
import { VehicleType, Vehicle } from "app/model/vehicle";
import { DriverInfo } from "./driver-info";
import { DriverStatus } from "./driver-status";

/**
 * Represents a driver.
 */
export class Driver extends DriverInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     * @param vehicleTypes The vehicle types associated with the driver, or undefined if unknown.
     */
    public constructor(data?: any, vehicleTypes?: VehicleType[])
    {
        super(data);

        if (data)
        {
            this.email = data.email;
            this.vehicleTypes = vehicleTypes;
            this.device = data.device;

            if (data.position)
            {
                this.position = new Position(data.position);
            }

            if (data.onlineVehicle)
            {
                this.onlineVehicle = new Vehicle(data.onlineVehicle);
            }
        }
        else
        {
            // HACK: This should not be done...
            this.status = new DriverStatus("approved");
            this.name = new PersonName();
            this.phone = new PhoneNumber();
            this.phone.countryCode = "45";
        }
    }

    /**
     * The device of the driver.
     */
    public device: { appVersion: string; os: string };

    /**
     * The email of the driver.
     */
    public email: string;

    /**
     * The phone number at which the driver can be contacted.
     */
    public position?: Position;

    /**
     * The password of the driver, only used for when creating.
     */
    public password: string;

    /**
     * The vehicle types associated with the driver,
     * or undefined if unknown.
     */
    public vehicleTypes: VehicleType[] | undefined;

    /**
     * The current online vehicle
     */
    public onlineVehicle?: Vehicle;
}
