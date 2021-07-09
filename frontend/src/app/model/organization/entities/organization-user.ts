import { DateTime } from "luxon";
import { IPhoneNumber } from "shared/types";
import { SearchModel } from "app/model/search-model";
import { OrganizationUserStatus } from "./organization-user-status";

/**
 * Represents a user within an organization.
 */
export class OrganizationUser
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.fullName = data.fullName;
        this.preferredName = data.preferredName;
        this.email = data.email;
        this.phoneNumber = data.phoneNumber;
        this.role = data.role;
        this.team = data.team;
        this.status = new OrganizationUserStatus(data.status);

        if (data.lastOnline != null)
        {
            this.lastOnline = DateTime.fromISO(data.lastOnline, { setZone: true });
        }
    }

    /**
     * The ID of the user.
     */
    public readonly id: string;

    /**
     * The full name of the user.
     */
    public fullName: string;

    /**
     * The preferred name of the user.
     */
    public preferredName: string;

    /**
     * The email of the user.
     */
    public email: string;

    /**
     * The phone number of the user, if any.
     */
    public phoneNumber: IPhoneNumber | undefined;

    /**
     * The role of the user within the organization.
     */
    public role: { id: string; name: string };

    /**
     * The team with which the user is associated, if any.
     */
    public team: { id: string; name: string } | undefined;

    /**
     * The status of the user.
     */
    public status: OrganizationUserStatus;

    /**
     * The date and time at which the user last signed in.
     */
    public readonly lastOnline: DateTime | undefined;

    /**
     * The model representing the searchable text in the entity.
     */
    public readonly searchModel = new SearchModel(this);
}
