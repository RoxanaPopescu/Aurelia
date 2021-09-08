/**
 * Represents info about an invite to join an organization.
 */
export class OrganizationUserInvite
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.organization = data.organization;
        this.role = data.role;
        this.team = data.team;
    }

    /**
     * The ID of the invite.
     */
    public readonly id: string;

    /**
     * The the organization that sent the invite.
     */
    public readonly organization: { id: string; name: string };

    /**
     * The role that would be assign to the user.
     */
    public readonly role: { id: string; name: string };

    /**
     * The team to which the user would be assigned, if any.
     */
    public readonly team: { id: string; name: string } | undefined;
}
