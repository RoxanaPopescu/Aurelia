import { autoinject, computedFrom } from "aurelia-framework";
import { MapObject } from "shared/types";
import { HistoryHelper, Log } from "shared/infrastructure";
import { ModalService } from "shared/framework";
import { LocalStateService } from "app/services/local-state";
import { RouteAssignmentService, RouteInfo, RouteService } from "app/model/route";
import { ListViewService, ListView, RouteListViewFilter } from "app/model/list-view";
import { IListViewPageItems, IListViewPageParams, ListViewsBasePage } from "./list-views-base";
import { AssignDriverPanel } from "../../modals/assign-driver/assign-driver";
import { AssignTeamPanel } from "../../modals/assign-team/assign-team";
import { AssignVehiclePanel } from "../../modals/assign-vehicle/assign-vehicle";
import { OrganizationService, OrganizationTeam } from "app/model/organization";
import { Fulfiller } from "app/model/outfit";
import { AssignOrganizationPanel } from "../../modals/assign-organization/assign-organization";
import { IdentityService, moverOrganizationId } from "app/services/identity";
import { TeamsFilterService } from "app/services/teams-filter";

/**
 * Represents the route parameters for the page.
 */
export interface IRouteListViewPageParams extends IListViewPageParams
{
}

/**
 * Represents the page.
 */
@autoinject
export class ListViewsPage extends ListViewsBasePage<RouteListViewFilter, RouteInfo>
{
    /**
     * Creates a new instance of the type.
     * @param historyHelper The `HistoryHelper` instance.
     * @param modalService The `ModalService` instance.
     * @param localStateService The `LocalStateService` instance.
     * @param listViewService The `ListViewService` instance.
     * @param routeService The `RouteService` instance.
     * @param routeAssignmentService The `RouteAssignmentService` instance.
     * @param teamsFilterService The `TeamsFilterService` instance.
     * @param organizationService The `OrganizationService` instance.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(
        historyHelper: HistoryHelper,
        modalService: ModalService,
        localStateService: LocalStateService,
        listViewService: ListViewService,
        routeService: RouteService,
        routeAssignmentService: RouteAssignmentService,
        teamsFilterService: TeamsFilterService,
        organizationService: OrganizationService,
        identityService: IdentityService)
    {
        super(historyHelper, modalService, localStateService, listViewService);

        this._routeService = routeService;
        this._routeAssignmentService = routeAssignmentService;
        this._teamsFilterService = teamsFilterService;
        this._organizationService = organizationService;
        this._identityService = identityService;
    }

    private readonly _routeService: RouteService;
    private readonly _routeAssignmentService: RouteAssignmentService;
    private readonly _teamsFilterService: TeamsFilterService;
    private readonly _organizationService: OrganizationService;
    private readonly _identityService: IdentityService;

    /**
     * The type of list views presented by the page.
     */
    protected readonly listViewType = "route";

    /**
     * The teams associated with the organization,
     * or undefined if not yet fetched.
     */
    protected teams: OrganizationTeam[] | undefined;

    /**
     * The style defining the grid template columns for the `data-table`.
     */
    @computedFrom("activeListView.definition.columns")
    protected get tableStyle(): MapObject
    {
        return { "grid-template-columns": `${this.activeListView?.definition.columns.map(c => c.width).join(" ")} min-content` };
    }

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

        const identity = this._identityService.identity!;
        const legacyOrganizationIds = [moverOrganizationId];

        return legacyOrganizationIds.includes(identity.organization!.id);
    }

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     */
    public async activate(params: IRouteListViewPageParams): Promise<void>
    {
        await super.activate(params);
    }

    /**
     * Called by the framework when the module is deactivated.
     */
    public async deactivate(): Promise<void>
    {
        await super.deactivate();
    }

    /**
     * Fetches the the items to present in the list.
     * Implementations must override this, to implement the actual fetching.
     * @param listView The list view for which to fetch.
     * @param signal The abort signal for the operation.
     * @returns A model representing the items to present in the list.
     */
    protected async fetch(listView: ListView<RouteListViewFilter, RouteInfo>, signal: AbortSignal): Promise<IListViewPageItems>
    {
        const filter = listView.definition.filter;

        await this.fetchTeamsIfNeeded(listView, signal);

        // TODO: Is this the right place to do this?
        // Update the global teams filter.
        this._teamsFilterService.selectedTeamIds = filter.teamsFilter;

        return await this.fetchRoutes(listView, signal);
    }

    /**
     * Called when rendering the items.
     * Gets the list of delayed stop numbers.
     */
    protected getDelayedStops(route: RouteInfo): number[] | undefined
    {
        return route.delayedStopIndexes?.map(d => d + 1);
    }

    /**
     * Called when rendering the items.
     * Gets the name of the specified team.
     */
    protected getTeamName(teamId?: string): string | undefined
    {
        if (teamId == null)
        {
            return undefined;
        }

        return this.teams!.find(t => t.id === teamId)?.name;
    }

    /**
     * Called when the `Show driving list` button is clicked on an item.
     * Opens the driving list for the specified route in a new window.
     */
    protected onShowDrivingListClick(route: RouteInfo): void
    {
        window.open(route.driverListUrl, "_blank");
    }

    /**
     * Called when the `Assign team` button is clicked on an item.
     * Opens the panel for assigning a team to a route.
     */
    protected async onAssignTeamClick(route: RouteInfo, updating: any): Promise<void>
    {
        const result = await this._modalService.open(AssignTeamPanel,
        {
            route: route,
            assignOnSelect: false

        }).promise;

        if (result != null)
        {
            const team = result === "no-team" ? undefined : result;

            const previousValue = route.teamId;
            route.teamId = team?.id;
            updating.team = true;

            try
            {
                await this._routeAssignmentService.assignTeam(route, team);
            }
            catch
            {
                route.teamId = previousValue;
                Log.error(`Could not assign the team '${team?.name}''`);
            }

            updating.team = false;
        }
    }

    /**
     * Called when the `Assign executor` button is clicked on an item.
     * Opens the panel for assigning a executor to a route.
     */
    protected async onAssignExecutorClick(route: RouteInfo, updating: any): Promise<void>
    {
        const executor = await this._modalService.open(AssignOrganizationPanel,
        {
            route: route,
            assignOnSelect: false
        }).promise;

        if (executor != null)
        {
            const previousValue = route.executor;
            route.executor = new Fulfiller({ id: executor.organization.id, companyName: executor.organization.name });
            updating.executor = true;

            try
            {
                await this._routeAssignmentService.assignExecutor(route, executor);
            }
            catch
            {
                route.executor = previousValue;
                Log.error(`Could not assign executor '${executor.organization.name}'`);
            }

            updating.executor = false;
        }
    }

    /**
     * Called when the `Assign driver` button is clicked on an item.
     * Opens the panel for assigning a driver to a route.
     */
    protected async onAssignDriverClick(route: RouteInfo, updating: any): Promise<void>
    {
        const driver = await this._modalService.open(AssignDriverPanel,
        {
            route: route,
            assignOnSelect: false

        }).promise;

        if (driver != null)
        {
            const previousValue = route.driver;
            route.driver = driver;
            updating.driver = true;

            try
            {
                await this._routeAssignmentService.assignDriver(route, driver);
            }
            catch
            {
                route.driver = previousValue;
                Log.error(`Could not assign the driver '${driver.name.toString()}'`);
            }

            updating.driver = false;
        }
    }

    /**
     * Called when the `Assign vehicle` button is clicked on an item.
     * Opens the panel for assigning a vehicle to a route.
     */
    protected async onAssignVehicleClick(route: RouteInfo, updating: any): Promise<void>
    {
        const vehicle = await this._modalService.open(AssignVehiclePanel,
        {
            route: route,
            assignOnSelect: false

        }).promise;

        if (vehicle != null)
        {
            const previousValue = route.vehicle;
            route.vehicle = vehicle;
            updating.vehicle = true;

            try
            {
                await this._routeAssignmentService.assignVehicle(route, vehicle);
            }
            catch
            {
                route.vehicle = previousValue;
                Log.error(`Could not assign the vehicle '${vehicle.name}'`);
            }

            updating.vehicle = false;
        }
    }

    /**
     * Fetches the the items to present in the list.
     * Implementations must override this, to implement the actual fetching.
     * @param listView The list view for which to fetch.
     * @param signal The abort signal for the operation.
     * @returns A model representing the items to present in the list.
     */
    private async fetchTeamsIfNeeded(listView: ListView<RouteListViewFilter, RouteInfo>, signal: AbortSignal): Promise<void>
    {
        const columnSlugs = listView.definition.columns.map(column => column.slug);

        // If needed, fetch the teams associated with the organization.
        try
        {
            if (this.teams == null && columnSlugs.includes("team"))
            {
                this.teams = await this._organizationService.getTeams();
            }
        }
        catch (error)
        {
            Log.error("An error occurred while fetching the teams.", error);

            throw error;
        }
    }

    /**
     * Fetches the the items to present in the list.
     * Implementations must override this, to implement the actual fetching.
     * @param listView The list view for which to fetch.
     * @param signal The abort signal for the operation.
     * @returns A model representing the items to present in the list.
     */
    private async fetchRoutes(listView: ListView<RouteListViewFilter, RouteInfo>, signal: AbortSignal): Promise<IListViewPageItems>
    {
        const filter = listView.definition.filter;
        const columnSlugs = listView.definition.columns.map(column => column.slug);

        // Fetch the list items.
        try
        {
            const assignedDriver = filter.assignedDriver !== filter.notAssignedDriver ? filter.assignedDriver : undefined;
            const assignedVehicle = filter.assignedVehicle !== filter.notAssignedVehicle ? filter.assignedVehicle : undefined;

            const result = await this._routeService.getAll(
            {
                statuses: filter.statusFilter,
                searchQuery: filter.textFilter,
                tagsAllMatching: filter.tagsFilter,
                startTimeFrom: filter.startTimeFromFilter,
                startTimeTo: filter.useRelativeStartTimeToFilter ? filter.startTimeToFilter : filter.startTimeToFilter?.endOf("day"),
                createdTimeFrom: filter.createdTimeFromFilter,
                createdTimeTo: filter.createdTimeToFilter?.endOf("day"),
                assignedDriver: assignedDriver,
                assignedVehicle: assignedVehicle,
                pickupNearby: (filter.pickupNearbyPosition != null) ? { position: filter.pickupNearbyPosition, precision: 3 } : undefined,
                teams: this._teamsFilterService.selectedTeamIds,
                orderedVehicleTypes: filter.orderedVehicleTypesFilter?.map(vt => vt.id),
                legacyOwnerIds: filter.legacyOwnerIdsFilter
            },
            {
                owner: columnSlugs.includes("owner"),
                vehicle: columnSlugs.includes("vehicle"),
                fulfiller: columnSlugs.includes("executor"),
                driver: columnSlugs.includes("driver") || columnSlugs.includes("driver-id"),
                tags: columnSlugs.includes("tags"),
                criticality: true,
                estimates: columnSlugs.includes("estimated-time-frame"),
                delayedStops: columnSlugs.includes("delayed-stops"),
                stops: columnSlugs.includes("distance") || columnSlugs.includes("estimated-time-start") || columnSlugs.includes("estimated-colli-count"),
                colli: columnSlugs.includes("colli-count")
            },
            listView.definition.sorting,
            listView.paging,
            signal);

            return { items: result.routes, itemCount: result.routeCount };
        }
        catch (error)
        {
            Log.error("An error occurred while fetching the items.", error);

            throw error;
        }
    }
}
