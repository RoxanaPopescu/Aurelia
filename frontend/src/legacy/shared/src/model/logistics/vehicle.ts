import { VehicleType } from "./vehicleType";

/**
 * Represents a vehicle that may be used to deliver a shipment.
 */
export class Vehicle {

  /* tslint:disable-next-line: no-any */
  public constructor(data: any) {
    this.id = data.id;
    this.licensePlate = data.licensePlate;
    this.vehicleType = VehicleType.get(data.vehicleTypeId);
    this.makeAndModel = data.makeAndModel;
    this.color = data.color;
  }
  
  /**
   * The ID of the vehicle.
   */
  public id: string;

  /**
   * The license plate of the vehicle.
   */
  public licensePlate: string;

  /**
   * The type of vehicle required or used to carry out the shipment.
   */
  public vehicleType: VehicleType;

  /**
   * The make and model of the vehicle.
   */
  public makeAndModel: string;

  /**
   * The color of the vehicle.
   */
  public color: string;
}