import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { Modal, IValidation } from "shared/framework";
import { OrganizationRole, OrganizationService, OrganizationTeam, OrganizationUser } from "app/model/organization";

/**
 * Represents a tab pane for managing the profile for a user.
 */
@autoinject
export class ProfilePaneCustomElement
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

    /**
     * True if the invite has been resent, otherwise false.
     */
    protected inviteResent = false;

    /**
     * The current fetch operation, if any.
     */
    protected operation: Operation | undefined;

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
     * The strings from which initials should be generated.
     */
    @computedFrom("user.preferredName")
    protected get initials(): (string | undefined)[]
    {
        return [this.user.preferredName];
    }

    /**
     * The user to present.
     */
    @bindable
    public user: OrganizationUser;

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        this.operation = new Operation(async () =>
        {
            this._modal.busy = true;

            try
            {
                [this.availableRoles, this.availableTeams] = await Promise.all(
                [
                    await this._organizationService.getRoles(),
                    await this._organizationService.getTeams()
                ]);

                this.selectedRole = this.availableRoles.find(r => r.id === this.user.role.id)!;

                if (this.user.team != null)
                {
                    this.selectedTeam = this.availableTeams.find(t => t.id === this.user.team!.id)!;
                }

                this._modal.busy = false;
            }
            catch (error)
            {
                Log.error("An error occurred while getting teams or roles.", error);
            }
        });
    }

    /**
     * Called by the framework when the component is detached.
     */
    public deactivate(): void
    {
        this.operation?.abort();
    }

    /**
     * Called when the `Save changes` button is clicked.
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

            if (this.selectedRole.id !== this.user.role.id)
            {
                await this._organizationService.changeUserRole(this.user.id, this.selectedRole.id);
            }

            if (this.selectedTeam?.id !== this.user.team?.id)
            {
                if (this.user.team != null)
                {
                    await this._organizationService.removeUserFromTeam(this.user.team!.id, this.user.id);
                }

                if (this.selectedTeam != null)
                {
                    await this._organizationService.addUserToTeam(this.user.team!.id, this.user.id);
                }
            }

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("An error occurred while saving the changes.", error);
        }
        finally
        {
            this._modal.busy = false;
        }
    }

    /**
     * Called when the `Resend invite` button is clicked.
     */
    protected async onResendInviteClick(): Promise<void>
    {
        try
        {
            await this._organizationService.reinviteUser(this.user.id);

            this.inviteResent = true;
        }
        catch (error)
        {
            Log.error("An error occurred while resending the invite.", error);
        }
    }
}
