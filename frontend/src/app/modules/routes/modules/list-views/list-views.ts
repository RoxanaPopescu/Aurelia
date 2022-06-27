import { autoinject, observable, computedFrom } from "aurelia-framework";
import { ISorting, IPaging, SortingDirection } from "shared/types";
import { Operation } from "shared/utilities";
import { HistoryHelper, IHistoryState, Log } from "shared/infrastructure";
import { IScroll, ModalService } from "shared/framework";
import { RouteService, RouteInfo, RouteStatusSlug, RouteAssignmentService, RouteView } from "app/model/route";
import { DateTime } from "luxon";
import { RouteListColumn } from "app/model/route/entities/route-list-column";
import { AssignDriverPanel } from "../../modals/assign-driver/assign-driver";
import { AssignVehiclePanel } from "../../modals/assign-vehicle/assign-vehicle";
import { AssignOrganizationPanel } from "../../modals/assign-organization/assign-organization";
import { SelectColumnsPanel } from "app/modals/panels/select-columns/select-columns";
import { AddressService } from "app/components/address-input/services/address-service/address-service";
import { IdentityService, moverOrganizationId } from "app/services/identity";
import { OrganizationService, OrganizationTeam } from "app/model/organization";
import { TeamsFilterService } from "app/services/teams-filter";
import { Fulfiller } from "app/model/outfit";
import { AssignTeamPanel } from "../../modals/assign-team/assign-team";
import { VehicleType } from "app/model/vehicle";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    page?: string;
    pageSize?: string;
    sortProperty?: string;
    sortDirection?: SortingDirection;
    textFilter?: string;
    statusFilter?: RouteStatusSlug;
    assignedDriver?: boolean;
    notAssignedDriver?: boolean;
    assignedVehicle?: boolean;
    notAssignedVehicle?: boolean;
    startTimeFromFilter?: string;
    startTimeToFilter?: string;
    relativeStartTimeFromFilter?: string;
    relativeStartTimeToFilter?: string;
    relativeStartTimeFromFilterUnit?: "days" | "hours" | undefined;
    relativeStartTimeToFilterUnit?: "days" | "hours" | undefined;
    teams?: string;
    tagsFilter?: string;
    orderedVehicleTypesFilter?: string;
    owners?: string;
    createdTimeFromFilter?: string;
    createdTimeToFilter?: string;
}

/**
 * Represents the page.
 */
@autoinject
export class ListViewsPage
{
    /**
     * Creates a new instance of the class.
     * @param routeService The `RouteService` instance.
     * @param modalService The `ModalService` instance.
     * @param routeAssignmentService The `RouteAssignmentService` instance.
     * @param historyHelper The `HistoryHelper` instance.
     * @param organizationService The `OrganizationService` instance.
     * @param teamsFilterService The `TeamsFilterService` instance.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(
        routeService: RouteService,
        addressService: AddressService,
        routeAssignmentService: RouteAssignmentService,
        modalService: ModalService,
        historyHelper: HistoryHelper,
        organizationService: OrganizationService,
        teamsFilterService: TeamsFilterService,
        identityService: IdentityService)
    {
        this._routeService = routeService;
        this._modalService = modalService;
        this._routeAssignmentService = routeAssignmentService;
        this._historyHelper = historyHelper;
        this._addressService = addressService;
        this._organizationService = organizationService;
        this.teamsFilterService = teamsFilterService;
        this._identityService = identityService;
        this._constructed = true;

        // TODO: Load last selection from local
        this.view = new RouteView(this);
    }

    private readonly _routeService: RouteService;
    private readonly _modalService: ModalService;
    private readonly _addressService: AddressService;
    private readonly _organizationService: OrganizationService;
    private readonly _routeAssignmentService: RouteAssignmentService;
    private readonly _historyHelper: HistoryHelper;
    private readonly _identityService: IdentityService;
    private readonly _constructed;

    /**
     * The IDs of the teams for which data should be presented, or undefined if no team is selected.
     */
    @observable({ changeHandler: "update" })
    protected teamsFilter: ("no-team" | string)[] | undefined;

    /**
     * The scroll manager for the page.
     */
    protected view: RouteView;

    /**
     * The scroll manager for the page.
     */
    protected scroll: IScroll;

    /**
     * The most recent update operation.
     */
    protected updateOperation: Operation;

    /**
     * The most recent update operation.
     */
    protected pickupNearbyOperation: Operation;

    /**
     * The ID of the currently expanded route, if any
     */
    protected expandedRouteId: string | undefined;

    /**
     * The available vehicle types.
     */
    protected availableVehicleTypes: VehicleType[];

    /**
     * The `TeamsFilterService` instance.
     */
    protected readonly teamsFilterService: TeamsFilterService;

    /**
     * The custom grid column widths calculated from the columns
     */
    @computedFrom("view.columns")
    protected get tableStyle(): any
    {
        return { "grid-template-columns": `${this.view.columns.map(c => c.width).join(" ")} min-content` };
    }

    /**
     * The sorting to use for the table.
     */
    @observable({ changeHandler: "update" })
    protected sorting: ISorting =
    {
        property: "start-date",
        direction: "descending"
    };

    /**
     * The paging to use for the table.
     */
    @observable({ changeHandler: "update" })
    protected paging: IPaging =
    {
        page: 1,
        pageSize: 30
    };

    /**
     * True if initial loading failed
     */
    protected failed: boolean = false;

    /**
     * The teams for the organization
     */
    protected teams: OrganizationTeam[] = [];

    /**
     * Our old system uses another 'user system', Mover Transport will need some legacy features in this transition period.
     */
    protected get showLegacy(): boolean
    {
        if (ENVIRONMENT.name !== "production")
        {
            return true;
        }

        const identity = this._identityService.identity;

        if (identity == null)
        {
            return false;
        }

        const legacyOrganizationIds = [moverOrganizationId];

        return legacyOrganizationIds.includes(identity.organization!.id);
    }

    /**
     * The total number of items matching the query, or undefined if unknown.
     */
    protected routeCount: number | undefined;

    /**
     * The items to present in the table.
     */
    protected results: RouteInfo[] | undefined;

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     */
    public activate(params: IRouteParams): void
    {
        this.paging.page = params.page != null ? parseInt(params.page) : this.paging.page;
        this.paging.pageSize = params.pageSize != null ? parseInt(params.pageSize) : this.paging.pageSize;
        this.sorting.property = params.sortProperty || this.sorting.property;
        this.sorting.direction = params.sortDirection || this.sorting.direction;

        this.availableVehicleTypes = VehicleType.getAll();
        this.teamsFilterService.fetchAccessibleTeams().catch(error => Log.error(error));
        this.update();
    }

    /**
     * Called by the framework when the module is deactivated.
     */
    public deactivate(): void
    {
        // Abort any existing operation.
        if (this.updateOperation != null)
        {
            this.updateOperation.abort();
        }
    }

    /**
     * Called when the user selects the route to show the driver list url from
     */
    public onShowDriverLink(route: RouteInfo): void
    {
        window.open(route.driverListUrl, "_blank");
    }

    /**
     * Called from the table when delayed stops are being represented
     */
    public delayedStops(route: RouteInfo): string | undefined
    {
        if (route.delayedStopIndexes)
        {
            return route.delayedStopIndexes.map(d => d + 1).join(", ");
        }

        return undefined;
    }

    /**
     * Called from the table when team is being represented
     */
    public teamName(teamId?: string): string | undefined
    {
        if (teamId == null)
        {
            return undefined;
        }

        return this.teams.find(t => t.id === teamId)?.name;
    }

    /**
     * Called when the `Assign executor` button is clicked.
     * Opens the panel for assigning a executor to a route, and once assigned, re-fetches the route.
     */
    protected async onAssignExecutorClick(route: RouteInfo, updating: any): Promise<void>
    {
        const executor = await this._modalService.open(
            AssignOrganizationPanel,
            { route: route, assignOnSelect: false }
        ).promise;

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
     * Called when the pickup nearby address has updated
     */
    protected pickupNearbyAddressChanged(): void
    {
        this.view.pickupNearbyPosition = undefined;
        if (this.pickupNearbyOperation != null)
        {
            this.pickupNearbyOperation.abort();
        }

        if (this.view.pickupNearbyAddress != null)
        {
            this.pickupNearbyOperation = new Operation(async signal =>
            {
                try
                {
                    const location = await this._addressService.getLocation(this.view.pickupNearbyAddress!);
                    this.view.pickupNearbyPosition = location.position;
                    this.update();
                }
                catch (error)
                {
                    Log.error("Could not resolve address location.", error);
                }
            });
        }
    }

    /**
     * Called when the `Assign vehicle` button is clicked.
     * Opens the panel for assigning a vehicle to a route, and once assigned, re-fetches the route.
     */
    protected async onAssignVehicleClick(route: RouteInfo, updating: any): Promise<void>
    {
        const vehicle = await this._modalService.open(
            AssignVehiclePanel,
            { route: route, assignOnSelect: false }
        ).promise;

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
     * Called when the `Assign driver` button is clicked.
     * Opens the panel for assigning a driver to a route, and once assigned, re-fetches the route.
     */
    protected async onAssignDriverClick(route: RouteInfo, updating: any): Promise<void>
    {
        const driver = await this._modalService.open(
            AssignDriverPanel,
            { route: route, assignOnSelect: false }
        ).promise;

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
     * Called when the `Assign team` button is clicked.
     * Opens the panel for assigning a team to a route, and once assigned, re-fetches the route.
     */
    protected async onAssignTeamClick(route: RouteInfo, updating: any): Promise<void>
    {
        const result = await this._modalService.open(
            AssignTeamPanel,
            { route: route, assignOnSelect: false }
        ).promise;

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
     * Called when the `Select columns` button is clicked.
     * Opens the panel for selecting the columns to see.
     */
    protected async onSelectColumnsClick(): Promise<void>
    {
        const model =
        {
            availableColumns: Object.keys(RouteListColumn.values).map(slug => new RouteListColumn(slug as any)),
            selectedColumns: this.view.columns
        };

        const selectedColumns = await this._modalService.open(SelectColumnsPanel, model).promise;

        if (selectedColumns != null)
        {
            localStorage.setItem("route-columns", JSON.stringify(selectedColumns));

            this.view.columns = selectedColumns as RouteListColumn[];
            this.results = undefined;
            this.update();
        }
    }

    /**
     * Called when a route in the route list is clicked.
     * Toggles the expanded state of the route.
     * @param route The route that was clicked.
     */
    protected onRouteClick(route: RouteInfo): void
    {
        this.expandedRouteId = this.expandedRouteId === route.id ? undefined : route.id;
    }

    /**
     * Updates the page by fetching the latest data.
     */
    public update(newValue?: any, oldValue?: any, propertyName?: string): void
    {
        // Return if the object is not constructed.
        // This is needed because the `observable` decorator calls the change handler when the
        // initial property value is set, which happens before the constructor is called.
        if (!this._constructed)
        {
            return;
        }

        // Update the global teams filter.
        this.teamsFilterService.selectedTeamIds = this.teamsFilter;

        // Abort any existing operation.
        if (this.updateOperation != null)
        {
            this.updateOperation.abort();
        }

        const columnSlugs = this.view.columns.map(c => c.slug);

        // Fetch teams if needed
        if (this.teams.length === 0 && columnSlugs.includes("team"))
        {
            // tslint:disable-next-line: no-floating-promises
            (async () =>
            {
                this.teams = await this._organizationService.getTeams();
            })();
        }

        // Create and execute the new operation.
        this.updateOperation = new Operation(async signal =>
        {
            this.failed = false;

            try
            {
                let assignedDriver: boolean | undefined;

                if (this.view.assignedDriver !== this.view.notAssignedDriver)
                {
                    assignedDriver = this.view.assignedDriver;
                }

                let assignedVehicle: boolean | undefined;

                if (this.view.assignedVehicle !== this.view.notAssignedVehicle)
                {
                    assignedVehicle = this.view.assignedVehicle;
                }

                // tslint:disable-next-line: no-floating-promises
                this._historyHelper.navigate((state: IHistoryState) =>
                {
                    state.params.page = propertyName !== "paging" ? 1 : this.paging.page;
                    state.params.pageSize = this.paging.pageSize;
                    state.params.sortProperty = this.sorting?.property;
                    state.params.sortDirection = this.sorting?.direction;
                },
                { trigger: false, replace: true });

                const result = await this._routeService.getAll(
                    {
                        statuses: this.view.statusFilter,
                        searchQuery: this.view.textFilter,
                        tagsAllMatching: this.view.tagsFilter,
                        startTimeFrom: this.view.startTimeFromFilter,
                        startTimeTo: this.view.useRelativeStartTimeToFilter ? this.view.startTimeToFilter : this.view.startTimeToFilter?.endOf("day"),
                        createdTimeFrom: this.view.createdTimeFromFilter,
                        createdTimeTo: this.view.createdTimeToFilter?.endOf("day"),
                        assignedDriver: assignedDriver,
                        assignedVehicle: assignedVehicle,
                        pickupNearby: (this.view.pickupNearbyPosition != null) ? { position: this.view.pickupNearbyPosition, precision: 3 } : undefined,
                        teams: this.teamsFilterService.selectedTeamIds,
                        orderedVehicleTypes: this.view.orderedVehicleTypesFilter?.map(vt => vt.id),
                        legacyOwnerIds: this.view.legacyOwnerIdsFilter
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
                    this.sorting,
                    this.paging,
                    signal
                );

                // Update the state.
                this.results = result.routes;
                this.routeCount = result.routeCount;

                // Reset page.
                if (propertyName !== "paging")
                {
                    this.paging.page = 1;
                }

                // Scroll to top.
                this.scroll?.reset();
            }
            catch (error)
            {
                this.failed = true;
                Log.error("An error occurred while loading the list.", error);
            }
        });
    }

    protected updateRelative(newValue: any, oldValue: any, propertyName: string): void
    {
        const now = DateTime.local();

        if (this.view.useRelativeStartTimeFromFilter && propertyName !== "relativeStartTimeFromFilterUnit")
        {
            const nowOrStartOfToday = this.view.relativeStartTimeFromFilterUnit === "days" ? now.startOf("day") : now;

            this.view.startTimeFromFilter = this.view.relativeStartTimeFromFilter != null ? nowOrStartOfToday.plus(this.view.relativeStartTimeFromFilter) : undefined;
        }
        else if (this.view.relativeStartTimeFromFilter != null)
        {
            this.view.relativeStartTimeFromFilter = undefined;
            this.view.startTimeFromFilter = undefined;
        }

        if (this.view.useRelativeStartTimeToFilter && propertyName !== "relativeStartTimeToFilterUnit")
        {
            const nowOrEndOfToday = this.view.relativeStartTimeToFilterUnit === "days" ? now.endOf("day") : now;

            this.view.startTimeToFilter = this.view.relativeStartTimeToFilter != null ? nowOrEndOfToday.plus(this.view.relativeStartTimeToFilter) : undefined;
        }
        else if (this.view.relativeStartTimeToFilter != null)
        {
            this.view.relativeStartTimeToFilter = undefined;
            this.view.startTimeToFilter = undefined;
        }
    }

    /**
     * Sets the current view state, to match the specified state.
     * @param state The view state to apply.
     */
    protected setViewState(state: any): void
    {
        this.view = new RouteView(this,state);

        this.results = undefined;
        this.update();
    }
}
