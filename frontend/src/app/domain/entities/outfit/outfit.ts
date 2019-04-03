import { Phone } from "app/domain/entities/shared";

/**
 * Represents the type of outfit
 */
export type OutfitType = "fulfiller" | "consignor" | "consignee" | "system";

/**
 * Represents a base type for entities such as a Consignor and Consignee.
 */
export class Outfit
{
    public constructor(data: any)
    {
        this.type = data.type;
        this.id = data.id;
        this.slug = data.publicId;
        this.companyName = data.companyName;
        this.personName = data.contactPerson;
        this.contactEmail = data.contactEmail;
        this.address = data.address;

        if (data.contactPhone != null)
        {
            this.contactPhone = new Phone(data.contactPhone);
        }
    }

    /**
     * The name of outfit type.
     */
    public readonly type: string | undefined;

    /**
     * The ID of the outfit.
     */
    public readonly id: string;

    /**
     * The slug identifying the outfit.
     */
    public readonly slug: string;

    /**
     * The name of the company,
     * or undefined if the outfit is not a company.
     */
    public readonly companyName?: string;

    /**
     * The name of the person representing the outfir,
     * or undefined if no person is associated with the outfit.
     */
    public readonly personName?: string;

    /**
     * The phone number at which the outfit can be contacted,
     * or undefined if the outfit has no phone.
     */
    public readonly contactPhone?: Phone;

    /**
     * The email address at which the outfit can be contacted,
     * or undefined if the outfit has no email.
     */
    public readonly contactEmail?: string;

    /**
     * The address of the outfit,
     * or undefined if the outfit has no address.
     */
    public readonly address?: string;

    /**
     * Gets the primary name of the outfit.
     */
    public get primaryName(): string
    {
        return this.companyName ? this.companyName : this.personName!;
    }

    /**
     * Gets the secondary name of the outfit.
     */
    public get secondaryName(): string | undefined
    {
        return this.companyName ? this.personName : undefined;
    }
}
