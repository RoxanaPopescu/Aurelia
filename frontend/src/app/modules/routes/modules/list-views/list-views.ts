import { autoinject, computedFrom } from "aurelia-framework";
import { Router } from "aurelia-router";
import { HistoryHelper, Log } from "shared/infrastructure";
import { ModalService } from "shared/framework";
import { LocalStateService } from "app/services/local-state";
import { Fulfiller } from "app/model/outfit";
import { OrganizationService, OrganizationTeam } from "app/model/organization";
import { RouteAssignmentService, RouteInfo, RouteService } from "app/model/route";
import { ListViewService, ListView, RouteListViewFilter, RouteListViewColumn, createListViewDefinition, ListViewDefinition } from "app/model/list-view";
import { IListViewPageItems, IListViewPageParams, ListViewsPage } from "app/modules/list-views/list-views";
import { AssignDriverPanel } from "../../modals/assign-driver/assign-driver";
import { AssignTeamPanel } from "../../modals/assign-team/assign-team";
import { AssignVehiclePanel } from "../../modals/assign-vehicle/assign-vehicle";
import { AssignOrganizationPanel } from "../../modals/assign-organization/assign-organization";
import { RouteFiltersPanel } from "./modals/route-filters/route-filters";
import defaultListViewNames from "./resources/strings/default-list-view-names.json";

/**
 * Represents the route parameters for the page.
 */
// tslint:disable-next-line: no-empty-interface
export interface IRouteListViewPageParams extends IListViewPageParams
{
}

/**
 * Represents the page.
 */
@autoinject
export class RouteListViewsPage extends ListViewsPage<RouteListViewFilter, RouteInfo>
{
    /**
     * Creates a new instance of the type.
     * @param router The `Router` instance.
     * @param historyHelper The `HistoryHelper` instance.
     * @param modalService The `ModalService` instance.
     * @param localStateService The `LocalStateService` instance.
     * @param listViewService The `ListViewService` instance.
     * @param routeService The `RouteService` instance.
     * @param routeAssignmentService The `RouteAssignmentService` instance.
     * @param organizationService The `OrganizationService` instance.
     */
    public constructor(
        router: Router,
        historyHelper: HistoryHelper,
        modalService: ModalService,
        localStateService: LocalStateService,
        listViewService: ListViewService,
        routeService: RouteService,
        routeAssignmentService: RouteAssignmentService,
        organizationService: OrganizationService)
    {
        super(router, historyHelper, modalService, localStateService, listViewService);

        this._routeService = routeService;
        this._routeAssignmentService = routeAssignmentService;
        this._organizationService = organizationService;
    }

    private readonly _routeService: RouteService;
    private readonly _routeAssignmentService: RouteAssignmentService;
    private readonly _organizationService: OrganizationService;

    /**
     * The type of list views presented by the page.
     */
    protected readonly listViewType = "route";

    /**
     * The type of list views presented by the page.
     */
    protected readonly listViewColumnType = RouteListViewColumn;

    /**
     * The teams associated with the organization,
     * or undefined if not yet fetched.
     */
    protected teams: OrganizationTeam[] | undefined;

    /**
     * Geta the number of active filter criteria, excluding the text filter.
     */
    @computedFrom("activeListView.definition.filter.activeCriteria")
    protected get activeFilterCount(): number | undefined
    {
        return this.activeListView?.definition.filter.activeCriteria.length;
    }

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     * @returns A promise that will be resolved when the operation completes.
     */
    public async activate(params: IRouteListViewPageParams): Promise<void>
    {
        await super.activate(params);
    }

    /**
     * Called by the framework when the module is deactivated.
     * @returns A promise that will be resolved when the operation completes.
     */
    public async deactivate(): Promise<void>
    {
        await super.deactivate();
    }

    /**
     * Called when the page is activated, and no list view has ever been opened.
     * Derived classes may override this to create a default list view definition.
     * @returns The default list view definition to open, or undefined to not open any view.
     */
    protected async createDefaultListView(): Promise<ListViewDefinition<RouteListViewFilter> | undefined>
    {
        const listViewDefinition = createListViewDefinition("route");
        listViewDefinition.name = defaultListViewNames.allRoutes;
        listViewDefinition.shared = false;

        return this._listViewService.create(listViewDefinition);
    }

    /**
     * Called when the `Add filter` or `{number} filters applied` button is clicked.
     * Opens the filters modal.
     */
    protected async onFiltersClick(): Promise<void>
    {
        await this._modalService.open(RouteFiltersPanel,
        {
            definition: this.activeListView!.definition
        })
        .promise;
    }

    /**
     * Called when the `Clear` icon is clicked on the `{number} filters applied` button.
     * Clears all filters, except the text filter.
     */
    protected onResetFiltersClick(event: MouseEvent): void
    {
        event.preventDefault();
        event.stopPropagation();

        for (const criterion of this.activeListView!.definition.filter.criteria)
        {
            criterion.clear();
        }
    }

    /**
     * Fetches the the items to present.
     * @param listView The list view for which to fetch.
     * @param signal The abort signal for the operation.
     * @returns A promise that will be resolved with a model representing the items to present.
     */
    protected async fetch(listView: ListView<RouteListViewFilter, RouteInfo>, signal: AbortSignal): Promise<IListViewPageItems>
    {
        await this.fetchTeamsIfNeeded(listView, signal);

        return this.fetchRoutes(listView, signal);
    }

    /**
     * Called when rendering the items.
     * Gets the list of delayed stop numbers for the specified route.
     * @param route The route for which to get delayed stop numbers.
     * @returns An array representing the delayed stop numbers, if any.
     */
    protected getDelayedStops(route: RouteInfo): number[] | undefined
    {
        return route.delayedStopIndexes?.map(d => d + 1);
    }

    /**
     * Called when rendering the items.
     * Gets the name of the specified team.
     * @param teamId The ID of the team for which to get the name.
     * @returns The name of the specified team, if found.
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
     * Called when an item in the list is clicked.
     * Toggles the expanded state of the item.
     * @param item The item that was clicked.
     */
    protected onItemClick(item: RouteInfo): void
    {
        this.activeListView!.expandedItemId = this.activeListView!.expandedItemId === item.id ? undefined : item.id;
    }

    /**
     * Called when the `Show driving list` button is clicked on an item.
     * Opens the driving list for the specified route in a new window.
     * @param route The route for which to show the driving list.
     */
    protected onShowDrivingListClick(route: RouteInfo): void
    {
        window.open(route.driverListUrl, "_blank");
    }

    /**
     * Called when the `Assign team` button is clicked on an item.
     * Opens the modal for assigning a team to a route.
     * @param route The route to which a team should be assigned.
     * @param updating The object representing the `updating` state of the item.
     * @returns A promise that will be resolved when the operation completes.
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
                Log.error(`Could not assign the team '${team?.name}'`);
            }

            updating.team = false;
        }
    }

    /**
     * Called when the `Assign executor` button is clicked on an item.
     * Opens the modal for assigning a executor to a route.
     * @param route The route to which an executor should be assigned.
     * @param updating The object representing the `updating` state of the item.
     * @returns A promise that will be resolved when the operation completes.
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
     * Opens the modal for assigning a driver to a route.
     * @param route The route to which a driver should be assigned.
     * @param updating The object representing the `updating` state of the item.
     * @returns A promise that will be resolved when the operation completes.
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
     * Opens the modal for assigning a vehicle to a route.
     * @param route The route to which a vehicle should be assigned.
     * @param updating The object representing the `updating` state of the item.
     * @returns A promise that will be resolved when the operation completes.
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
     * @param listView The list view for which to fetch.
     * @param signal The abort signal for the operation.
     * @returns A promise that will be resolved when the operation completes.
     */
    private async fetchTeamsIfNeeded(listView: ListView<RouteListViewFilter, RouteInfo>, signal: AbortSignal): Promise<void>
    {
        const columnSlugs = listView.definition.columns.map(column => column.slug);

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
     * Fetches the the items to present.
     * @param listView The list view for which to fetch.
     * @param signal The abort signal for the operation.
     * @returns A promise that will be resolved with a model representing the items to present.
     */
    private async fetchRoutes(listView: ListView<RouteListViewFilter, RouteInfo>, signal: AbortSignal): Promise<IListViewPageItems>
    {
        const filter = listView.definition.filter;
        const columnSlugs = listView.definition.columns.map(column => column.slug);

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
                teams: filter.teamsFilter,
                orderedVehicleTypes: filter.orderedVehicleTypesFilter?.map(vt => vt.id),
                legacyOwnerIds: filter.legacyOwnerIdsFilter
            },
            {
                owner: columnSlugs.includes("owner"),
                vehicle: columnSlugs.includes("vehicle") || columnSlugs.includes("vehicle-type-dispatched"),
                fulfiller: columnSlugs.includes("executor"),
                driver: columnSlugs.includes("driver") || columnSlugs.includes("driver-id") || columnSlugs.includes("driver-telephone-number"),
                tags: columnSlugs.includes("tags"),
                criticality: true,
                estimates: columnSlugs.includes("estimated-time-frame"),
                delayedStops: columnSlugs.includes("delayed-stops"),
                stops: columnSlugs.includes("distance") || columnSlugs.includes("estimated-time-start") || columnSlugs.includes("estimated-colli-count") || columnSlugs.includes("stop-company-name") ||
                columnSlugs.includes("stop-user-name") || columnSlugs.includes("stop-user-telephone") || columnSlugs.includes("stop-ready-date") || columnSlugs.includes("stop-ready-time") || columnSlugs.includes("stop-close-date") ||
                columnSlugs.includes("stop-close-time"),
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
