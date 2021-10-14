import { VehicleType } from "app/model/vehicle";


/**
 * Represents a vehicle that may be used to deliver a shipment.
 */
export class Vehicle {

  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.licensePlate = data.licensePlate;
    this.vehicleType = VehicleType.get(data.vehicleTypeId);
    this.make = data.make;
    this.model = data.model;
    this.productionYear = data.productionYear;
    this.color = data.color;
    this.totalGrossWeight = data.totalGrossWeight;
    this.registrationCertificateUrl = data.registrationCertificateUrl;
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
    public totalGrossWeight?: number;

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
    public vehicleType: VehicleType;

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
