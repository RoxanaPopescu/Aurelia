import { autoinject, computedFrom } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { IValidation, Modal } from "shared/framework";
import { IdentityService } from "app/services/identity";
import { OrganizationRole, OrganizationService, OrganizationTeam, OrganizationUser } from "app/model/organization";
import { addToRecentEntities } from "app/modules/starred/services/recent-item";

 /**
  * Represents a modal panel that presents the public profile of a user.
  */
@autoinject
export class UserModalPanel
{
    /**
     * Creates a new instance of the type.
     * @param identityService The `IdentityService` instance.
     * @param organizationService The `OrganizationService` instance.
     * @param modal The `Modal` instance representing the modal.
     */
    public constructor(identityService: IdentityService, organizationService: OrganizationService, modal: Modal)
    {
        this._identityService = identityService;
        this._organizationService = organizationService;
        this._modal = modal;
    }

    private readonly _identityService: IdentityService;
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
     * True if the modal is readonly, otherwise false.
     */
    protected readonly: boolean;

    /**
     * The user to present.
     */
    protected user: OrganizationUser;

    /**
     * The available teams.
     */
    protected availableTeams: OrganizationTeam[] | undefined;

    /**
     * The selected teams, if any.
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
     * True if the modal has unsaved changes, otherwise false.
     */
    @computedFrom("selectedRole", "user.role", "selectedTeams.length", "user.teams.length")
    protected get hasChanges(): boolean
    {
        if (this.selectedRole?.id !== this.user.role.id)
        {
            return true;
        }

        if (this.selectedTeams?.map(t => t.id).sort().join(" ") !== this.user.teams.map(t => t.id).sort().join(" "))
        {
            return true;
        }

        return false;
    }

    /**
     * Called by the framework when the modal is activating.
     * @param user The user to present.
     */
    public activate(model: { readonly: boolean; user: OrganizationUser }): void
    {
        this.user = model.user;
        this.readonly = model.readonly ?? false;

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
                this.selectedTeams = this.availableTeams.filter(t1 => this.user.teams.some(t2 => t2.id === t1.id));

                this._modal.busy = false;
            }
            catch (error)
            {
                Log.error("An error occurred while getting teams or roles.", error);
            }

            addToRecentEntities(this.user.toEntityInfo());
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

            const updateTeamsPromises: Promise<any>[] = [];

            for (const team of this.selectedTeams?.filter(t1 => !this.user.teams.some(t2 => t2.id === t1.id)) ?? [])
            {
                updateTeamsPromises.push(this._organizationService.addUserToTeam(team.id, this.user.id)
                    .then(() => this.user.teams.push(team)));
            }

            for (const team of this.user.teams.filter(t1 => !this.selectedTeams?.some(t2 => t2.id === t1.id)) ?? [])
            {
                updateTeamsPromises.push(this._organizationService.removeUserFromTeam(team.id, this.user.id)
                    .then(() => this.user.teams.splice(this.user.teams.findIndex(t => t.id === team.id), 1)));
            }

            if (updateTeamsPromises.length > 0)
            {
                // Ensure bindings are updated.
                this.user.teams = [...this.user.teams];
            }

            await Promise.all(updateTeamsPromises);

            if (this.selectedRole!.id !== this.user.role.id)
            {
                await this._organizationService.changeUserRole(this.user.id, this.selectedRole!.id)
                    .then(() => this.user.role = this.selectedRole!);
            }

            if (this.user.id === this._identityService.identity!.id)
            {
                // Reauthenticate to ensure we get the updated permissions.
                await this._identityService.reauthorize();
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
