import { Session } from "../session";

/**
 * Represents a vehicle types.
 */
export class VehicleType {

  /**
   * Gets the vehicle type with the specified ID.
   */
  public static get(id: string): VehicleType {
    return Session.vehicleTypes.find(vt => vt.id === id)!;
  }

  /**
   * Gets all supported vehicle types.
   */
  public static getAll(): VehicleType[] {
    return Session.vehicleTypes;
  }

  /* tslint:disable: no-any */
  public constructor(data: any) {
    this.deprecated = data.deprecated;
    this.id = data.id;
    this.slug = data.slug;
    this.maxHeight = data.maxHeight;
    this.maxWidth = data.maxWidth;
    this.maxWeight = data.maxWeight;
    this.name = data.name.da;
    this.images = data.images;
  }

  /**
   * True if the vehicle type is deprecated, otherwise false.
   */
  public readonly deprecated: boolean;

  /**
   * The ID of the vehicle type.
   */
  public readonly id: string;

  /**
   * The slug identifying the vehicle type.
   */
  public readonly slug: string;

  /**
   * The height of the cargo space.
   */
  public readonly maxHeight: number;

  /**
   * The width of the cargo space.
   */
  public readonly maxWidth: number;

  /**
   * The length of the cargo space.
   */
  public readonly maxLength: number;

  /**
   * The max weight of the cargo.
   */
  public readonly maxWeight: number;

  /**
   * The localized name of the vehicle type.
   */
  public readonly name: string;

  /**
   * The URLs for the images representing the vehicle type, indexed by size.
   */
  public readonly images: { [type: string]: string };
}
