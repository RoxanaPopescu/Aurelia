import { autoinject } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { Modal, IValidation } from "shared/framework";
import { OrganizationService, OrganizationUser, IOrganizationUserInviteInit, OrganizationTeam, OrganizationRole } from "app/model/organization";
import { Operation } from "shared/utilities";

@autoinject
export class InviteUserPanel
{
    /**
     * Creates a new instance of the type.
     * @param organizationService The `OrganizationService` instance.
     * @param modal The `Modal` instance representing the modal.
     */
    public constructor(organizationService: OrganizationService, modal: Modal)
    {
        this._organizationService = organizationService;
        this._modal = modal;
    }

    private readonly _organizationService: OrganizationService;
    private readonly _modal: Modal;
    private _fetchOperation: Operation | undefined;
    private _result: OrganizationUser | undefined;

    /**
     * The new invite.
     */
    protected invite: IOrganizationUserInviteInit;

    /**
     * The email addresses of all the users currently in the organization,
     * used for validation to prevent inviting an existing member.
     */
    protected unavailableEmailAddresses: string[] | undefined;

    /**
     * The available teams.
     */
    protected availableTeams: OrganizationTeam[] | undefined;

    /**
     * The selected team, if any.
     */
    protected selectedTeams: OrganizationTeam[] | undefined;

    /**
     * The available roles.
     */
    protected availableRoles: OrganizationRole[] | undefined;

    /**
     * The selected role.
     */
    protected selectedRole: OrganizationRole | undefined;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The model to use.
     */
    public activate(model?: Partial<IOrganizationUserInviteInit>): void
    {
        this.invite = model ?? {} as any;

        this._fetchOperation = new Operation(async () =>
        {
            this._modal.busy = true;

            try
            {
                [this.unavailableEmailAddresses, this.availableRoles, this.availableTeams] = await Promise.all(
                [
                    (await this._organizationService.getUsers()).map(user => user.email),
                    await this._organizationService.getRoles(),
                    await this._organizationService.getTeams()
                ]);

                if (this.invite.roleId)
                {
                    this.selectedRole = this.availableRoles.find(r => r.id === this.invite.roleId)!;
                }

                if (this.invite.teamIds)
                {
                    this.selectedTeams = this.availableTeams.filter(t => this.invite.teamIds!.includes(t.id));

                    if (this.selectedTeams.length === 0)
                    {
                        this.selectedTeams = undefined;
                    }
                }

                this._modal.busy = false;
            }
            catch (error)
            {
                Log.error("An error occurred while getting teams, roles, or existing users.", error);
            }
        });
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The invited user, or undefined if cancelled.
     */
    public async deactivate(): Promise<OrganizationUser | undefined>
    {
        this._fetchOperation?.abort();

        return this._result;
    }

    /**
     * Called when the `Send invite` button is clicked.
     */
    protected async onSubmitClick(): Promise<void>
    {
        try
        {
            // Activate validation so any further changes will be validated immediately.
            this.validation.active = true;

            // Validate the form.
            if (!await this.validation.validate())
            {
                return;
            }

            this._modal.busy = true;

            this.invite.roleId = this.selectedRole!.id;
            this.invite.teamIds = this.selectedTeams?.map(t => t.id);

            this._result = await this._organizationService.inviteUser(this.invite);

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("An error occurred while inviting the user.", error);
        }
        finally
        {
            this._modal.busy = false;
        }
    }
}
