import { autoinject } from "aurelia-framework";
import { AbortError, ISorting, SortingDirection } from "shared/types";
import { getPropertyValue, Operation } from "shared/utilities";
import { Log, HistoryHelper, IHistoryState } from "shared/infrastructure";
import { ModalService } from "shared/framework";
import { IdentityService } from "app/services/identity";
import { OrganizationService, OrganizationTeam } from "app/model/organization";
import { EditTeamPanel } from "./modals/edit-team/edit-team";
import { ConfirmDeleteTeamDialog } from "./modals/confirm-delete-team/confirm-delete-team";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    sortProperty?: string;
    sortDirection?: SortingDirection;
    text?: string;
}

/**
 * Represents the page.
 */
@autoinject
export class TeamsPage
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
    private _teams: OrganizationTeam[] | undefined;

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
     * The teams to present in the table.
     */
    protected get orderedAndFilteredTeams(): OrganizationTeam[] | undefined
    {
        if (this._teams == null)
        {
            return undefined;
        }

        const offset = this.sorting.direction === "ascending" ? 1 : -1;

        return this._teams

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

        this.fetch();
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
    protected fetch(): void
    {
        const organizationId = this._identityService.identity!.outfit!.id;

        // Abort any existing operation.
        this.operation?.abort();

        // Create and execute the new operation.
        this.operation = new Operation(async signal =>
        {
            this._teams = await this._organizationService.getTeams(organizationId, signal);
        });

        this.operation.promise.catch(error =>
        {
            if (!(error instanceof AbortError))
            {
                Log.error("Could not get the teams within the organization", error);
            }
        });
    }

    /**
     * Called when the `New team` button is clicked.
     * Opens a modal for creating a new team.
     */
    protected async onNewTeamClick(): Promise<void>
    {
        const organizationId = this._identityService.identity!.outfit!.id;
        const newTeam = await this._modalService.open(EditTeamPanel, { organizationId }).promise;

        if (newTeam != null)
        {
            this._teams!.push(newTeam);
        }
    }

    /**
     * Called when the `Edit` icon is clicked on a team.
     * Opens a modal for editing the team.
     * @param team The team to edit.
     */
    protected async onEditTeamClick(team: OrganizationTeam): Promise<void>
    {
        const organizationId = this._identityService.identity!.outfit!.id;
        const newTeam = await this._modalService.open(EditTeamPanel, { organizationId, team }).promise;

        if (newTeam != null)
        {
            this._teams!.splice(this._teams!.indexOf(team), 1, newTeam);
        }
    }

    /**
     * Called when the `Delete` icon is clicked on a team.
     * Asks for confirmation, then deletes the team.
     * @param team The team to delete.
     */
    protected async onDeleteTeamClick(team: OrganizationTeam): Promise<void>
    {
        const confirmed = await this._modalService.open(ConfirmDeleteTeamDialog, team).promise;

        if (!confirmed)
        {
            return;
        }

        const organizationId = this._identityService.identity!.outfit!.id;

        try
        {
            await this._organizationService.deleteTeam(organizationId, team.id);

            this._teams!.splice(this._teams!.indexOf(team), 1);
        }
        catch (error)
        {
            Log.error("Could not delete the team", error);
        }
    }
}
