import { autoinject } from "aurelia-framework";
import { HistoryHelper, Log } from "shared/infrastructure";
import { ModalService } from "shared/framework";
import { LocalStateService } from "app/services/local-state";
import { RouteAssignmentService, RouteInfo, RouteService } from "app/model/route";
import { ListViewService, ListView, RouteListViewFilter, RouteListViewColumn } from "app/model/list-view";
import { SelectColumnsPanel } from "app/modals/panels/select-columns/select-columns";
import { IListViewPageItems, IListViewPageParams, ListViewsPage } from "./list-views-base";
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
        this._organizationService = organizationService;
        this._identityService = identityService;
        this.teamsFilterService = teamsFilterService;
    }

    private readonly _routeService: RouteService;
    private readonly _routeAssignmentService: RouteAssignmentService;
    private readonly _organizationService: OrganizationService;
    private readonly _identityService: IdentityService;

    /**
     * The `TeamsFilterService` instance.
     */
    private readonly teamsFilterService: TeamsFilterService;

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
     * Fetches the the items to present.
     * @param listView The list view for which to fetch.
     * @param signal The abort signal for the operation.
     * @returns A promise that will be resolved with a model representing the items to present.
     */
    protected async fetch(listView: ListView<RouteListViewFilter, RouteInfo>, signal: AbortSignal): Promise<IListViewPageItems>
    {
        const filter = listView.definition.filter;

        await this.fetchTeamsIfNeeded(listView, signal);

        // TODO: Is this the right place to do this?
        // Update the global teams filter.
        this.teamsFilterService.selectedTeamIds = filter.teamsFilter;

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
                Log.error(`Could not assign the team '${team?.name}''`);
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
     * Called when the `Save view` button is clicked.
     * Saves the changes to the current view.
     * @returns A promise that will be resolved when the operation completes.
     */
    protected async onSaveViewClick(): Promise<void>
    {
        const listView = this.activeListView!;

        try
        {
            listView.definition = await this._listViewService.update(listView.definition);
            listView.hasUnsavedChanges = false;
        }
        catch (error)
        {
            Log.error("Could not save the view changes", error);
        }
    }

    /**
     * Called when the `Edit view` button is clicked.
     * Opens the modal for editing the view.
     * @returns A promise that will be resolved when the operation completes.
     */
    protected async onEditViewClick(): Promise<void>
    {
        // const listView = this.activeListView!;

        // TODO
    }

    /**
     * Called when the `Select columns` button is clicked.
     * Opens the modal for selecting the columns to see.
     */
    protected async onSelectColumnsClick(): Promise<void>
    {
        const listView = this.activeListView!;

        const model =
        {
            availableColumns: Object.keys(RouteListViewColumn.values).map(slug => new RouteListViewColumn(slug as any)),
            selectedColumns: listView.definition.columns
        };

        const result = await this._modalService.open(SelectColumnsPanel, model).promise;

        if (result != null)
        {
            listView.definition.columns = result as RouteListViewColumn[];

            this.update(listView);
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
                teams: this.teamsFilterService.selectedTeamIds,
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
