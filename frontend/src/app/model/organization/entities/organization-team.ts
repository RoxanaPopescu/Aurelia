import clone from "clone";
import { IPhoneNumber } from "shared/types";
import { Address } from "app/model/shared";
import { SearchModel } from "app/model/search-model";

/**
 * Represents a team within an organization.
 */
export class OrganizationTeam
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
            this.name = data.name;
            this.phoneNumber = data.phoneNumber;
            this.address = new Address(data.address);
            this.vatNumber = data.vatNumber;
            this.invoiceDirectly = data.invoiceDirectly;
            this.invoiceEmail = data.invoiceEmail;
            this.userCount = data.userCount;
        }
    }

    /**
     * The ID of the role.
     */
    public readonly id: string;

    /**
     * The name of the role.
     */
    public name: string;

    /**
     * The phone number of the team, if any.
     */
    public phoneNumber: IPhoneNumber | undefined;

    /**
     * The address of the team, if any.
     */
    public address: Address | undefined;

    /**
     * The VAT number for the team, if any.
     */
    public vatNumber: string | undefined;

    /**
     * True to invoice the team directly, otherwise false.
     */
    public invoiceDirectly: boolean;

    /**
     * The email to which invoices should be sent,
     * or undefined if not invoiced directly.
     */
    public invoiceEmail: string | undefined;

    /**
     * The number of users associated with the team.
     */
    public readonly userCount: number;

    /**
     * The model representing the searchable text in the entity.
     */
    public readonly searchModel = new SearchModel(this);

    /**
     * Gets a clone of this instance, suitable for editing.
     */
    public clone(): any
    {
        return clone(this);
    }
}
