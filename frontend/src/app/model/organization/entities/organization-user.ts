import { computedFrom } from "aurelia-framework";
import { DateTime } from "luxon";
import { IPhoneNumber } from "shared/types";
import { SearchModel } from "app/model/search-model";
import { OrganizationUserStatus } from "./organization-user-status";

/**
 * Represents a user, or user invite, within an organization.
 */
export class OrganizationUser
{
    /**
     * Creates a new instance of the type.
     * @param isInvite True if this user represents an invite, and not a real user, otherwise false.
     * @param data The response data from which the instance should be created.
     */
    public constructor(isInvite: boolean, data: any)
    {
        if (isInvite)
        {
            this.id = data.id;
            this.email = data.email;
            this.role = data.role;
            this.team = data.team;
            this.status = new OrganizationUserStatus("invited");
        }
        else
        {
            this.id = data.id;
            this.fullName = data.fullName;
            this.preferredName = data.preferredName;
            this.email = data.email;
            this.phoneNumber = data.phoneNumber;
            this.pictureUrl = data.pictureUrl;
            this.role = data.role;
            this.team = data.team;
            this.status = new OrganizationUserStatus("active");

            if (data.lastOnline != null)
            {
                this.lastOnline = DateTime.fromISO(data.lastOnline, { setZone: true });
            }
        }
    }

    /**
     * The ID of the user, or if the user represents an invite, the ID of the invite.
     */
    public readonly id: string;

    /**
     * The full name of the user, or undefined if the user represents an invite.
     */
    public fullName: string | undefined;

    /**
     * The preferred name of the user, or undefined if the user represents an invite.
     */
    public preferredName: string | undefined;

    /**
     * The email of the user.
     */
    public email: string;

    /**
     * The phone number of the user, if any.
     */
    public phoneNumber: IPhoneNumber | undefined;

    /**
     * The URL for the user picture, if any.
     */
    public pictureUrl: string | undefined;

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
    public readonly status: OrganizationUserStatus;

    /**
     * The date and time at which the user last signed in.
     */
    public readonly lastOnline: DateTime | undefined;

    /**
     * The model representing the searchable text in the entity.
     */
    public readonly searchModel = new SearchModel(this);

    /**
     * The initials to show if no picture is available.
     */
    @computedFrom("fullName", "preferredName", "email")
    public get initials(): string
    {
        return (this.fullName || this.preferredName || this.email).trim()[0];
    }
}
