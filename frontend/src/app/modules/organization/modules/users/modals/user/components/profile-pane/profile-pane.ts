import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
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
     */
    public constructor(organizationService: OrganizationService)
    {
        this._organizationService = organizationService;
    }

    private readonly _organizationService: OrganizationService;

    /**
     * True if the invite has been resent, otherwise false.
     */
    protected inviteResent = false;

    /**
     * The current fetch operation, if any.
     */
    protected operation: Operation | undefined;

    /**
     * The user to present.
     */
    @bindable
    public user: OrganizationUser;

    /**
     * The available teams.
     */
    @bindable
    public availableTeams: OrganizationTeam[] | undefined;

    /**
     * The selected team, if any.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public selectedTeam: OrganizationTeam | undefined;

    /**
     * The available roles.
     */
    @bindable
    public availableRoles: OrganizationRole[] | undefined;

    /**
     * The selected role.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public selectedRole: OrganizationRole;

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
