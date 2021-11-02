import clone from "clone";
import { EntityInfo } from "app/types/entity";
import { Dimensions } from "app/model/shared";
import { VehicleType } from "./vehicle-type";
import { VehicleStatus } from "./vehicle-status";

/**
 * Represents a vehicle that may be used to deliver a shipment.
 */
export class Vehicle
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.id = data.id;
            this.status = new VehicleStatus(data.status);
            this.name = data.name;
            this.licensePlate = data.licensePlate;
            this.type = VehicleType.get(data.type);
            this.make = data.make;
            this.model = data.model;
            this.productionYear = data.productionYear;
            this.color = data.color;
            this.approvedTotalWeight = data.approvedTotalWeight;
            this.registrationCertificateUrl = data.registrationCertificateUrl;

            if (data.internalDimensions)
            {
                this.internalDimensions = new Dimensions(data.internalDimensions);
            }
        }
    }

    /**
     * The ID of the vehicle.
     */
    public id: string;

    /**
     * The name of the vehicle, if any.
     */
    public name?: string;

    /**
     * The status of the vehicle.
     */
    public status: VehicleStatus;

    /**
     * The maximum allowed weight of the vehicle with all load (including persons).
     */
    public approvedTotalWeight?: number;

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
    public get makeAndModel(): string
    {
        return `${this.make} ${this.model}`;
    }

    /**
     * Gets a clone of this instance, suitable for editing.
     */
    public clone(): any
    {
        return clone(this);
    }

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            id: this.id,
            name: this.name,
            status: this.status.slug,
            approvedTotalWeight: this.approvedTotalWeight,
            internalDimensions: this.internalDimensions,
            licensePlate: this.licensePlate,
            type: this.type.id,
            typeSlug: this.type.slug,
            make: this.make,
            model: this.model,
            productionYear: this.productionYear,
            color: this.color
        };
    }

    /**
     * Gets an `EntityInfo` instance representing this instance.
     */
    public toEntityInfo(): EntityInfo
    {
        return new EntityInfo(
        {
            type: "vehicle",
            id: this.id,
            name: this.name || [this.make, this.model, this.productionYear].filter(e => e).join(", "),
            description: this.licensePlate
        });
    }
}
