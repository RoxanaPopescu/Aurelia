import { Phone } from "app/model/shared";
import { OutfitType } from "./outfit-type";
import { computedFrom } from "aurelia-binding";

/**
 * Represents a base type for entities such as a Consignor and Consignee.
 */
export class Outfit
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        const type = (data.type || data.typeName || "").toLowerCase();
        this.type = new OutfitType(type);

        this.id = data.id;
        this.slug = data.publicId;
        this.companyName = data.companyName;
        this.personName = data.contactPerson;
        this.contactEmail = data.contactEmail;
        this.address = data.address;

        if (data != null && data.contactPhone != null)
        {
            this.contactPhone = new Phone(data.contactPhone);
        }
    }

    /**
     * The name of outfit type, if known.
     */
    public readonly type: OutfitType;

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
    @computedFrom("companyName", "personName")
    public get primaryName(): string
    {
        return this.companyName ? this.companyName : this.personName!;
    }

    /**
     * Gets the secondary name of the outfit.
     */
    @computedFrom("companyName", "personName")
    public get secondaryName(): string | undefined
    {
        return this.companyName ? this.personName : undefined;
    }

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            type: this.type.slug,
            id: this.id,
            slug: this.slug,
            companyName: this.companyName,
            contactPerson: this.personName,
            contactPhone: this.contactPhone,
            contactEmail: this.contactEmail,
            address: this.address
        };
    }
}
