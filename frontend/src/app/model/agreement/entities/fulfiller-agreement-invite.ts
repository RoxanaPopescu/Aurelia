/**
 * Represents a fulfiller agreement invite.
 */
export class FulfillerAgreementInvite
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
     * The first name of the user.
     */
    public userFirstName: string;

    /**
     * The last name of the user.
     */
    public userLastName: string;

    /**
     * The email for the user.
     */
    public userEmail: string;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            publicId: this.outfitSlug,
            companyName: this.outfitName,
            firstName: this.userFirstName,
            lastName: this.userLastName,
            email: this.userEmail
        };
    }
}
