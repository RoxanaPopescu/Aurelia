import { autoinject, computedFrom } from "aurelia-framework";
import { AbortError, ISorting } from "shared/types";
import { getPropertyValue, Operation } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { Modal, ModalService } from "shared/framework";
import { OrganizationService, OrganizationUser } from "app/model/organization";
import { UserModalPanel } from "../../../users/modals/user/user";

@autoinject
export class ManageTeamUsersPanel
{
    /**
     * Creates a new instance of the type.
     * @param organizationService The `OrganizationService` instance.
     * @param modalService The `ModalService` instance.
     * @param modal The `Modal` instance representing the modal.
     */
    public constructor(organizationService: OrganizationService, modalService: ModalService, modal: Modal)
    {
        this._organizationService = organizationService;
        this._modalService = modalService;
        this._modal = modal;
    }

    private readonly _organizationService: OrganizationService;
    private readonly _modalService: ModalService;
    private readonly _modal: Modal;
    private _organizationUsers: OrganizationUser[] | undefined;
    private _teamUsers: OrganizationUser[];

    /**
     * The ID of the team.
     */
    protected teamId: string;

    /**
     * The most recent operation.
     */
    protected operation: Operation;

    /**
     * The text filter to apply, if any.
     */
    protected textFilter: string | undefined;

    /**
     * The sorting to use for the table.
     */
    protected sorting: ISorting =
    {
        property: "fullName",
        direction: "ascending"
    };

    /**
     * The users to present in the table.
     */
    @computedFrom("_organizationUsers.length", "sorting", "textFilter")
    protected get orderedAndFilteredUsers(): OrganizationUser[] | undefined
    {
        if (this._organizationUsers == null)
        {
            return undefined;
        }

        const offset = this.sorting.direction === "ascending" ? 1 : -1;

        return this._organizationUsers

            // Filtering
            .filter(user => !this.textFilter || user.searchModel.contains(this.textFilter))

            // Sorting
            .sort((a, b) =>
            {
                const aPropertyValue = getPropertyValue(a, this.sorting.property)?.toString();
                const bPropertyValue = getPropertyValue(b, this.sorting.property)?.toString();

                // Sort by selected column and direction.
                if (aPropertyValue < bPropertyValue) { return -offset; }
                if (aPropertyValue > bPropertyValue) { return offset; }

                return 0;
            });
    }

    /**
     * Called by the framework when the modal is activated.
     * @param model The model to use.
     */
    public activate(model: { teamId: string; users: OrganizationUser[] }): void
    {
        this.teamId = model.teamId;
        this._teamUsers = model.users;

        this.fetchUsersInOrganization();
    }

    /**
     * Called by the framework when the modal is deactivated.
     */
    public deactivate(): void
    {
        // Abort any existing operation.
        this.operation?.abort();
    }

    /**
     * Called when the `Add user` icon is clicked on a user.
     */
    protected async onAddUserClick(user: OrganizationUser): Promise<void>
    {
        try
        {
            this._modal.busy = true;

            await this._organizationService.addUserToTeam(this.teamId, user.id);

            this._teamUsers.push(user);

            (user as any).__added = true;
        }
        catch (error)
        {
            Log.error("An error occurred while adding the user.", error);
        }
        finally
        {
            this._modal.busy = false;
        }
    }

    /**
     * Called when the `Remove user` icon is clicked on a user.
     */
    protected async onRemoveUserClick(user: OrganizationUser): Promise<void>
    {
        try
        {
            this._modal.busy = true;

            await this._organizationService.removeUserFromTeam(this.teamId, user.id);

            this._teamUsers?.splice(this._teamUsers.findIndex(u => u.id === user.id), 1);

            (user as any).__added = false;
        }
        catch (error)
        {
            Log.error("An error occurred while removing the user.", error);
        }
        finally
        {
            this._modal.busy = false;
        }
    }

    /**
     * Called when a user, or its `Edit user` icon, is clicked.
     * Opens a modal presenting the public profile of the user.
     * @param user The user that was clicked.
     */
     protected async onUserClick(user: OrganizationUser): Promise<void>
     {
         await this._modalService.open(UserModalPanel, user).promise;
     }

    /**
     * Fetches the users within the organization.
     */
    protected fetchUsersInOrganization(): void
    {
        // Abort any existing operation.
        this.operation?.abort();

        // Create and execute the new operation.
        this.operation = new Operation(async signal =>
        {
            this._organizationUsers = (await this._organizationService.getUsers(signal))
                .filter(user => user.status.slug === "active");

            for (const user of this._organizationUsers)
            {
                (user as any).__added = this._teamUsers.some(u => u.id === user.id);
            }
        });

        this.operation.promise.catch(error =>
        {
            if (!(error instanceof AbortError))
            {
                Log.error("Could not get the users within the organization", error);
            }
        });
    }
}
