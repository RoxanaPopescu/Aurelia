/**
 * Represents a fulfiller agreement invite.
 */
export class ConsignorAgreementInvite
{
    /**
     * The name of the fulfiller.
     */
    public outfitName: string;

    /**
     * The slug to use for the fulfiller.
     */
    public outfitSlug: string;

    /**
     * The address of the fulfiller.
     */
    public outfitAddress: string;

    /**
     * The first name of the contact person.
     */
    public contactFirstName: string;

    /**
     * The last name of the contact person.
     */
    public contactLastName: string;

    /**
     * The email for the contact person.
     */
    public contactEmail: string;

    /**
     * The phone for the contact person.
     */
    public contactPhone: string;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            publicId: this.outfitSlug,
            companyName: this.outfitName,
            firstName: this.contactFirstName,
            lastName: this.contactLastName,
            email: this.contactEmail,
            contactPhone: { countryPrefix: "+45", number: this.contactPhone },
            address: this.outfitAddress
        };
    }
}
