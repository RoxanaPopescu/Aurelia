import { VehicleType } from "./vehicle-type";
import { Dimensions } from "app/model/shared";

/**
 * Represents a vehicle that may be used to deliver a shipment.
 */
export class Vehicle
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.name = data.name;
        this.licensePlate = data.licensePlate;
        this.type = VehicleType.get(data.type);
        this.make = data.make;
        this.model = data.model;
        this.productionYear = data.productionYear;
        this.color = data.color;
        this.allowedTotalWeight = data.allowedTotalWeight;
        this.registrationCertificateUrl = data.registrationCertificateUrl;
        if (data.internalDimensions) {
            this.internalDimensions = new Dimensions(data.internalDimensions);
        }
    }

    /**
     * The ID of the vehicle.
     */
    public id: string;

    /**
     * The name of the vehicle.
     */
    public name?: string;

    /**
     * The maximum allowed weight of the vehicle with all load (including persons).
     */
    public allowedTotalWeight?: number;

    /**
     * The internal dimensions of the vehicle, can be used for route planning
     */
    public internalDimensions?: Dimensions;

    /**
     * The url of the registration certificate.
     */
    public registrationCertificateUrl?: string;

    /**
     * The license plate of the vehicle.
     */
    public licensePlate: string;

    /**
     * The type of vehicle required or used to carry out the shipment.
     */
    public type: VehicleType;

    /**
     * The make of the vehicle.
     */
    public make: string;

    /**
     * The model of the vehicle.
     */
    public model: string;

    /**
     * The model of the vehicle.
     */
    public productionYear: number;

    /**
     * The color of the vehicle.
     */
    public color: string;

    /**
     * The make and model of the vehicle.
     */
    public get makeAndModel(): string {
        return `${this.make} ${this.model}`;
    }
}
