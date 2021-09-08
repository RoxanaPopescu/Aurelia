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
     * The available teams.
     */
    protected availableTeams: OrganizationTeam[] | undefined;

    /**
     * The selected team, if any.
     */
    protected selectedTeam: OrganizationTeam | undefined;

    /**
     * The available roles.
     */
    protected availableRoles: OrganizationRole[] | undefined;

    /**
     * The selected role.
     */
    protected selectedRole: OrganizationRole;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * Called by the framework when the modal is activated.
     * @param model The model to use.
     */
    public activate(): void
    {
        this._fetchOperation = new Operation(async () =>
        {
            this._modal.busy = true;

            try
            {
                [this.availableRoles, this.availableTeams] = await Promise.all(
                [
                    await this._organizationService.getRoles(),
                    await this._organizationService.getTeams()
                ]);

                this._modal.busy = false;
            }
            catch (error)
            {
                Log.error("An error occurred while getting teams or roles.", error);
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

            this.invite.roleId = this.selectedRole.id;
            this.invite.teamId = this.selectedTeam?.id;

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
