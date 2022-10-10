import clone from "clone";
import { autoinject, computedFrom } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { ListViewDefinition, RouteListViewFilter } from "app/model/list-view";
import { IListViewFilterCriterion } from "app/model/list-view/entities/list-view-filter-criterion";
import { IdentityService, moverOrganizationId } from "app/services/identity";
import { OrganizationService, OrganizationTeam } from "app/model/organization";
import { VehicleType } from "app/model/vehicle";

export type RouteFiltersPanelView = "active-filters" | "add-filter" | "edit-filter";
/**
 * Represents the model for a `RouteFiltersPanel` instance.
 */
export interface IRouteFiltersPanelModel
{
    /**
     * The list view definition.
     */
    definition: ListViewDefinition<RouteListViewFilter>;
}

/**
 * Represents a modal panel for selecting and ordering the columns that should be presented in a list.
 */
@autoinject
export class RouteFiltersPanel
{
    /**
     * Creates a new instance of the class.
     * @param identityService The `IdentityService` instance.
     * @param organizationService The `OrganizationService` instance.
     */
    public constructor(identityService: IdentityService, organizationService: OrganizationService)
    {
        this._identityService = identityService;
        this.availableVehicleTypes = VehicleType.getAll();

        organizationService.getTeams()
            .then(teams => this.teams = [{ id: "no-team" }, ...teams ])
            .catch(error => Log.error("An error occurred while fetching the teams.", error));
    }

    private readonly _identityService: IdentityService;

    /**
     * The teams accessible to the user, or undefined if not yet fetched.
     */
    private teams: (OrganizationTeam | { id: "no-team" })[] | undefined;

    /**
     * The model for the modal.
     */
    protected model: ListViewDefinition<RouteListViewFilter>;

    /**
     * The slug identifying the view that was previously presented.
     */
    protected previousView: RouteFiltersPanelView | undefined;

    /**
     * The slug identifying the view to present.
     */
    protected view: RouteFiltersPanelView;

    /**
     * The filter criterion currently being edited, if any.
     */
    protected criterion: IListViewFilterCriterion | undefined;

    /**
     * The query text entered in the filter inpur in the `add-filter` view, if any.
     */
    protected queryText: string | undefined;

    /**
     * The filtered list of available criteria.
     */
    @computedFrom("queryText")
    protected get filteredCriteria(): IListViewFilterCriterion[]
    {
        if (this.queryText)
        {
            return this.model.filter.criteria.filter(c => c.name.toLowerCase().includes(this.queryText!.toLowerCase()));
        }

        return this.model.filter.criteria;
    }

    //#region "Filter specific properties"

    /**
     * The available vehicle types.
     */
    protected availableVehicleTypes: VehicleType[];

    /**
     * HACK:
     * Our old system uses another 'user system'.
     * Mover Transport will need some legacy features in this transition period.
     */
    protected get showLegacy(): boolean
    {
        if (ENVIRONMENT.name !== "production")
        {
            return true;
        }

        const legacyOrganizationIds = [moverOrganizationId];

        return legacyOrganizationIds.includes(this._identityService.identity!.organization!.id);
    }

    //#endregion

    /**
     * Called by the framework when the modal is activated.
     * @param model The stop to edit, or undefined to create a new stop.
     */
    public activate(model: IRouteFiltersPanelModel): void
    {
        this.model = model.definition;
        this.view = this.model.filter.criteria.some(c => c.summary != null) ? "active-filters" : "add-filter";
    }

    /**
     * Called when the `Filters` breadcrumb in the panel title is clicked.
     */
    protected onBackToActiveFiltersClick(): void
    {
        this.setView("active-filters");
    }

    /**
     * Called when the `Add` breadcrumb in the panel title is clicked.
     */
    protected onBackToAddFilterClick(): void
    {
        this.setView("add-filter");
    }

    /**
     * Called when the `Reset` icon in the panel is clicked.
     */
    protected onResetClick(): void
    {
        for (const criterion of this.model.filter.criteria)
        {
            criterion.clear();
        }
    }

    /**
     * Called when the `Add filter` button in the `active-filters` view is clicked.
     */
    protected onAddFilterClick(): void
    {
        this.setView("add-filter");
    }

    /**
     * Called when a `Remove filter` icon in the `active-filters` view is clicked.
     * @returns False to prevent default.
     */
    protected onRemoveFilterClick(criterion: IListViewFilterCriterion): boolean
    {
        criterion.clear();

        return false;
    }

    /**
     * Called when a filter is chosen in the `active-filters` or `add-filter` view.
     * @param criterion The filter criterion that was chosen.
     */
    protected onChooseFilter(criterion: IListViewFilterCriterion): void
    {
        this.criterion = clone(criterion);

        this.setView("edit-filter");
    }

    /**
     * Called when the `Apply` button in the `edit-filter` view is clicked.
     */
    protected onApplyFilterClick(): void
    {
        Object.assign(this.model.filter, this.criterion!.model);

        this.setView("active-filters");
    }

    //#region "Filter specific methods"

    /**
     * Gets the name of the specified team.
     * @param teamId The ID of the team for which to get the name.
     * @returns The name of the specified team, if found.
     */
    protected getTeamName(teamId?: string): string | null | undefined
    {
        if (teamId == null)
        {
            return null;
        }

        return (this.teams?.find(t => t.id === teamId) as OrganizationTeam | undefined)?.name;
    }

    //#endregion

    /**
     * Presents the specified view.
     * @param view The slug identifying the view to present.
     */
    private setView(view: RouteFiltersPanelView): void
    {
        this.previousView = this.view;
        this.view = view;

        if (view !== "edit-filter")
        {
            this.criterion = undefined;
        }
    }
}
