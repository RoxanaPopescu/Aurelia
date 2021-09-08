import { autoinject } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { IValidation, Modal } from "shared/framework";
import { OrganizationRole, OrganizationService, OrganizationTeam, OrganizationUser } from "app/model/organization";

 /**
  * Represents a modal panel that presents the public profile of a user.
  */
@autoinject
export class UserModalPanel
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
     * The name of the selected tab.
     */
    protected selectedTab: "profile" | "security" = "profile";

    /**
     * The current fetch operation, if any.
     */
    protected operation: Operation | undefined;

    /**
     * The user to present.
     */
    protected user: OrganizationUser;

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
     * Called by the framework when the modal is activating.
     * @param user The user to present.
     */
    public activate(user: OrganizationUser): void
    {
        this.user = user;

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
                    await this._organizationService.removeUserFromTeam(this.user.team.id, this.user.id);
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
}