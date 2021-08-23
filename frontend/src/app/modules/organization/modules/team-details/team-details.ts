import { autoinject } from "aurelia-framework";
import { AbortError, ISorting, SortingDirection } from "shared/types";
import { getPropertyValue, Operation } from "shared/utilities";
import { Log, HistoryHelper, IHistoryState } from "shared/infrastructure";
import { ModalService } from "shared/framework";
import { IdentityService } from "app/services/identity";
import { OrganizationService, OrganizationTeam, OrganizationUser } from "app/model/organization";
import { AddUserToTeamPanel } from "./modals/add-user-to-team/add-user-to-team";
import { ConfirmRemoveUserDialog } from "./modals/confirm-remove-user/confirm-remove-user";
import { UserModalPanel } from "../users/modals/user/user";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    teamId: string;
    sortProperty?: string;
    sortDirection?: SortingDirection;
    text?: string;
}

/**
 * Represents the page.
 */
@autoinject
export class TeamDetailsPage
{
    /**
     * Creates a new instance of the class.
     * @param modalService The `ModalService` instance.
     * @param identityService The `IdentityService` instance.
     * @param organizationService The `OrganizationService` instance.
     * @param historyHelper The `HistoryHelper` instance.
     */
    public constructor(modalService: ModalService, identityService: IdentityService, organizationService: OrganizationService, historyHelper: HistoryHelper)
    {
        this._modalService = modalService;
        this._identityService = identityService;
        this._organizationService = organizationService;
        this._historyHelper = historyHelper;
    }

    private readonly _modalService: ModalService;
    private readonly _identityService: IdentityService;
    private readonly _organizationService: OrganizationService;
    private readonly _historyHelper: HistoryHelper;
    private _users: OrganizationUser[] | undefined;

    /**
     * The team to present.
     */
    protected team: OrganizationTeam;

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
        property: "name",
        direction: "descending"
    };

    /**
     * The users to present in the table.
     */
    protected get orderedAndFilteredUsers(): OrganizationUser[] | undefined
    {
        if (this._users == null)
        {
            return undefined;
        }

        const offset = this.sorting.direction === "ascending" ? 1 : -1;

        return this._users

            // Filtering
            .filter(team => !this.textFilter || team.searchModel.contains(this.textFilter))

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
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     */
    public activate(params: IRouteParams): void
    {
        this.sorting.property = params.sortProperty || this.sorting.property;
        this.sorting.direction = params.sortDirection || this.sorting.direction;
        this.textFilter = params.text || this.textFilter;

        this.fetch(params.teamId);
    }

    /**
     * Called by the framework when the module is deactivated.
     */
    public deactivate(): void
    {
        // Abort any existing operation.
        this.operation?.abort();
    }

    /**
     * Called by the framework when the `textFilter` property changes.
     */
    public textFilterChanged(): void
    {
        // tslint:disable-next-line: no-floating-promises
        this._historyHelper.navigate((state: IHistoryState) =>
        {
            state.params.text = this.textFilter || undefined;
        },
        { trigger: false, replace: true });
    }

    /**
     * Called by the framework when the `sorting` property changes.
     */
    public sortingChanged(): void
    {
        // tslint:disable-next-line: no-floating-promises
        this._historyHelper.navigate((state: IHistoryState) =>
        {
            state.params.sortProperty = this.sorting?.property || undefined;
            state.params.sortDirection = this.sorting?.direction || undefined;
        },
        { trigger: false, replace: true });
    }

    /**
     * Fetches the latest data.
     */
    protected fetch(teamId: string): void
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        // Abort any existing operation.
        this.operation?.abort();

        // Create and execute the new operation.
        this.operation = new Operation(async signal =>
        {
            this.team = await this._organizationService.getTeam(organizationId, teamId, signal);
            this._users = await this._organizationService.getUsersInTeam(organizationId, teamId, signal);
        });

        this.operation.promise.catch(error =>
        {
            if (!(error instanceof AbortError))
            {
                Log.error("Could not get the users within the team", error);
            }
        });
    }

    /**
     * Called when a row in the user table is clicked.
     * Opens a modal presenting the public profile of the user.
     * @param user The user that was clicked.
     */
    protected async onUserClick(user: OrganizationUser): Promise<void>
    {
        await this._modalService.open(UserModalPanel, user).promise;
    }

    /**
     * Called when the `Invite user` button is clicked.
     * Opens a modal for inviting a user.
     */
    protected async onInviteUserClick(): Promise<void>
    {
        const organizationId = this._identityService.identity!.outfit!.id;
        const newUser = await this._modalService.open(AddUserToTeamPanel, { organizationId, teamId: this.team.id }).promise;

        if (newUser != null)
        {
            this._users!.push(newUser);
        }
    }

    /**
     * Called when the `Remove` icon is clicked on a user.
     * Asks for confirmation, then deletes the user.
     * @param user The user to delete.
     */
    protected async onRemoveUserClick(user: OrganizationUser): Promise<void>
    {
        const confirmed = await this._modalService.open(ConfirmRemoveUserDialog, user).promise;

        if (!confirmed)
        {
            return;
        }

        const organizationId = this._identityService.identity!.outfit!.id;

        try
        {
            await this._organizationService.removeUserFromTeam(organizationId, this.team.id, user.id);

            this._users!.splice(this._users!.indexOf(user), 1);
        }
        catch (error)
        {
            Log.error("Could not remove the user from the team", error);
        }
    }
}
