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
     * The ID of the team to which the user should be assigned, if any.
     */
    teamId: string | undefined;

    /**
     * The message to include in the invite email.
     */
    message: string | undefined;
}
