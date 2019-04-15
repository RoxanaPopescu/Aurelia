import { Phone } from "../general/phone";

/**
 * Represents the type of outfit
 */
export type OutfitType = "Fulfiller" | "Consignor" | "Consignee" | "System";

/**
 * Represents a base type for entities such as a Consignor, Consignee and Fulfiller.
 */
export class Outfit {
  /* tslint:disable-next-line: no-any */
  public constructor(data: any, typeName?: OutfitType) {
    this.id = data.id;
    this.publicId = data.publicId;
    this.companyName = data.companyName;
    this.contactPerson = data.contactPerson;
    this.contactEmail = data.contactEmail;
    this.address = data.address;
    this.typeName = typeName;

    if (data.contactPhone != null) {
      this.contactPhone = new Phone(data.contactPhone);
    }
  }

  /**
   * The ID of the outfit.
   */
  public id: string;

  /**
   * The public ID of the outfit.
   */
  public publicId: string;

  /**
   * The name of the company, or undefined if the
   * outfit is not a company.
   */
  public companyName?: string;

  /**
   * The name of the contact person at the outfit,
   * or undefined if the outfit has no contact person.
   */
  public contactPerson?: string;

  /**
   * The phone number at which the outfit can be contacted,
   * or undefined if the outfit has no phone.
   */
  public contactPhone?: Phone;

  /**
   * The email address at which the outfit can be contacted,
   * or undefined if the outfit has no email.
   */
  public contactEmail?: string;

  /**
   * The address at which the outfit can be found at,
   * or undefined if the outfit has no address.
   */
  public address?: string;

  /**
   * Gets the primary name of the outfit.
   */
  public get primaryName(): string {
    return this.companyName ? this.companyName : this.contactPerson!;
  }

  /**
   * Gets the secondary name of the outfit.
   */
  public get secondaryName(): string | undefined {
    return this.companyName ? this.contactPerson : undefined;
  }

  /**
   * The name of outfit type, if known.
   */
  public readonly typeName: OutfitType | undefined;
}
