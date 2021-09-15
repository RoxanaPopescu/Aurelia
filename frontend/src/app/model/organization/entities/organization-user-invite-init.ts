/**
 * Represents an invite to join an organization.
 */
export interface IOrganizationUserInviteInit
{
    /**
     * The email of the user to invite.
     */
    email: string;

    /**
     * The ID of the role to assign to the user.
     */
    roleId: string;

    /**
     * The IDs of the teams to which the user should be assigned, if any.
     */
    teamIds: string[] | undefined;

    /**
     * The message to include in the invite email.
     */
    message: string | undefined;
}
