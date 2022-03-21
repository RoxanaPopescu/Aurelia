import { computedFrom } from "aurelia-binding";
import { EntityInfo } from "app/types/entity";
import { PhoneNumber } from "app/model/shared";
import { OutfitType } from "./outfit-type";

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
        const type = (data.type || data.typeName || "unknown").toLowerCase();
        this.type = new OutfitType(type);

        this.id = data.id;
        this.slug = data.publicId;
        this.companyName = data.companyName ?? data.name;
        this.personName = data.contactPerson;
        this.contactEmail = data.contactEmail;
        this.address = data.address;
        this.legacyId = data.legacyId;

        if (data != null && data.contactPhone != null && data.contactPhone.number)
        {
            this.contactPhone = new PhoneNumber(data.contactPhone);
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

    // TODO: Remove asap - only used by department list, I think.
    /**
     * The slug identifying the outfit,
     * or undefined if the outfit has no slug.
     */
    public readonly slug?: string;

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
    public readonly contactPhone?: PhoneNumber;

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
     * The legacy id of this outfit in NOI
     */
    public readonly legacyId?: string;

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
            address: this.address,
            legacyId: this.legacyId
        };
    }

    /**
     * Gets an `EntityInfo` instance representing this instance.
     */
    public toEntityInfo(): EntityInfo
    {
        return new EntityInfo(
        {
            type: this.companyName ? "organization" : "unknown",
            id: this.id,
            name: this.companyName ?? this.personName
        });
    }
}
