import { autoinject, observable, computedFrom } from "aurelia-framework";
import { ISorting, IPaging, SortingDirection } from "shared/types";
import { Operation } from "shared/utilities";
import { HistoryHelper, IHistoryState, Log } from "shared/infrastructure";
import { IScroll, ModalService } from "shared/framework";
import { RouteService, RouteInfo, RouteStatusSlug, RouteAssignmentService } from "app/model/route";
import { DateTime, Duration } from "luxon";
import { RouteListViewColumn } from "app/model/list-view";
import { AssignDriverPanel } from "../../modals/assign-driver/assign-driver";
import { AssignVehiclePanel } from "../../modals/assign-vehicle/assign-vehicle";
import { AssignOrganizationPanel } from "../../modals/assign-organization/assign-organization";
import { SelectColumnsPanel } from "app/modals/panels/select-columns/select-columns";
import { Address, Position } from "app/model/shared";
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
export class ListPage
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

        const storedColumnsJson = localStorage.getItem("route-columns");

        if (storedColumnsJson != null)
        {
            this.customColumns = JSON.parse(storedColumnsJson)
                // HACK: Fallback values needed to support existing data.
                .filter(column => Object.keys(RouteListViewColumn.values).includes(column.slug ?? column))
                .map(column => new RouteListViewColumn(column.slug ?? column, column.width));
        }
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
     * The nearby pickup position
     */
    private pickupNearbyPosition?: Position;

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
    @computedFrom("columns")
    protected get tableStyle(): any
    {
        return { "grid-template-columns": `${this.columns.map(c => c.width).join(" ")} min-content` };
    }

    /**
     * The custom columns the user has selected
     */
    protected customColumns: RouteListViewColumn[] | undefined;

    /**
     * The current columns to show in the list
     */
    @computedFrom("customColumns")
    protected get columns(): RouteListViewColumn[]
    {
        return this.customColumns ?? [
            new RouteListViewColumn("slug"),
            new RouteListViewColumn("reference"),
            new RouteListViewColumn("start-date"),
            new RouteListViewColumn("start-address"),
            new RouteListViewColumn("tags"),
            new RouteListViewColumn("stop-count"),
            new RouteListViewColumn("vehicle-type"),
            new RouteListViewColumn("status"),
            new RouteListViewColumn("driving-list")
        ];
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
     * The nearby pickup address
     */
    @observable
    protected pickupNearbyAddress?: Address;

    /**
     * The name identifying the selected status tab.
     */
    @observable({ changeHandler: "update" })
    protected statusFilter: RouteStatusSlug[] | undefined;

    /**
     * The text in the search text input.
     */
    @observable({ changeHandler: "update" })
    protected textFilter: string | undefined;

    /**
     * True to show routes for which a driver is assigned.
     */
    @observable({ changeHandler: "update" })
    protected assignedDriver: boolean = false;

    /**
     * True to show routes for which a driver is not assigned.
     */
    @observable({ changeHandler: "update" })
    protected notAssignedDriver: boolean = false;

    /**
     * True to show routes for which a vehicle is assigned.
     */
    @observable({ changeHandler: "update" })
    protected assignedVehicle: boolean = false;

    /**
     * True to show routes for which a vehicle is assigned.
     */
    @observable({ changeHandler: "update" })
    protected notAssignedVehicle: boolean = false;

    /**
     * The vehicle types for which routes should be shown.
     */
    @observable({ changeHandler: "update" })
    protected orderedVehicleTypesFilter: VehicleType[] | undefined;

    /**
     * The tags for which routes should be shown.
     */
    @observable({ changeHandler: "update" })
    protected tagsFilter: any[] = [];

    /**
     * The min date for which routes should be shown.
     */
    @observable({ changeHandler: "update" })
    protected startTimeFromFilter: DateTime | undefined;

    /**
     * The max date for which routes should be shown.
     */
    @observable({ changeHandler: "update" })
    protected startTimeToFilter: DateTime | undefined;

    /**
     * True to use `relativeStartTimeFromFilter`, otherwise false.
     */
     @observable({ changeHandler: "updateRelative" })
    protected useRelativeStartTimeFromFilter = false;

    /**
     * The min relative time for which routes should be shown.
     */
    @observable({ changeHandler: "updateRelative" })
    protected relativeStartTimeFromFilter: Duration | undefined;

    /**
     * The unit in which `relativeStartTimeFromFilter` is specified.
     */
     @observable({ changeHandler: "updateRelative" })
    protected relativeStartTimeFromFilterUnit: "days" | "hours" | undefined;

    /**
     * True to use `relativeStartTimeToFilter`, otherwise false.
     */
     @observable({ changeHandler: "updateRelative" })
    protected useRelativeStartTimeToFilter = false;

    /**
     * The max relative time for which routes should be shown.
     */
    @observable({ changeHandler: "updateRelative" })
    protected relativeStartTimeToFilter: Duration | undefined;

    /**
     * The unit in which `relativeStartTimeToFilter` is specified.
     */
     @observable({ changeHandler: "updateRelative" })
    protected relativeStartTimeToFilterUnit: "days" | "hours" | undefined;

    /**
     * The min created date for which routes should be shown.
     */
    @observable({ changeHandler: "update" })
    protected createdTimeFromFilter: DateTime | undefined;

    /**
     * The max created date for which routes should be shown.
     */
    @observable({ changeHandler: "update" })
    protected createdTimeToFilter: DateTime | undefined;

    /**
     * The legacy owner IDs to show, only used by Mover Transport in a transition phase.
     */
    @observable({ changeHandler: "update" })
    protected legacyOwnerIdsFilter: any[] | undefined;

    /**
     * The IDs of the teams for which data should be presented, or undefined if no team is selected.
     */
    @observable({ changeHandler: "update" })
    protected teamsFilter: ("no-team" | string)[] | undefined;

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
        this.textFilter = params.textFilter || this.textFilter;
        this.statusFilter = params.statusFilter ? params.statusFilter.split(",") as any : this.statusFilter;
        this.assignedDriver = params.assignedDriver != null ? Boolean(params.assignedDriver) : this.assignedDriver;
        this.notAssignedDriver = params.notAssignedDriver != null ? Boolean(params.notAssignedDriver) : this.notAssignedDriver;
        this.assignedVehicle = params.assignedVehicle != null ? Boolean(params.assignedVehicle) : this.assignedVehicle;
        this.notAssignedVehicle = params.notAssignedVehicle != null ? Boolean(params.notAssignedVehicle) : this.notAssignedVehicle;
        this.startTimeFromFilter = params.startTimeFromFilter ? DateTime.fromISO(params.startTimeFromFilter, { setZone: true }) : undefined;
        this.startTimeToFilter = params.startTimeToFilter ? DateTime.fromISO(params.startTimeToFilter, { setZone: true }) : undefined;
        this.tagsFilter = params.tagsFilter?.split(",") || this.tagsFilter;
        this.orderedVehicleTypesFilter = params.orderedVehicleTypesFilter?.split(",").map(slug => VehicleType.getBySlug(slug)) || this.orderedVehicleTypesFilter;

        this.legacyOwnerIdsFilter = params.owners?.split(",");
        this.createdTimeFromFilter = params.createdTimeFromFilter ? DateTime.fromISO(params.createdTimeFromFilter, { setZone: true }) : undefined;
        this.createdTimeToFilter = params.createdTimeToFilter ? DateTime.fromISO(params.createdTimeToFilter, { setZone: true }) : undefined;

        this.relativeStartTimeFromFilterUnit = params.relativeStartTimeFromFilterUnit || "hours";
        this.useRelativeStartTimeFromFilter = params.relativeStartTimeFromFilter != null;
        this.relativeStartTimeFromFilter = params.relativeStartTimeFromFilter ? Duration.fromISO(params.relativeStartTimeFromFilter) : undefined;

        this.relativeStartTimeToFilterUnit = params.relativeStartTimeToFilterUnit || "hours";
        this.useRelativeStartTimeToFilter = params.relativeStartTimeToFilter != null;
        this.relativeStartTimeToFilter = params.relativeStartTimeToFilter ? Duration.fromISO(params.relativeStartTimeToFilter) : undefined;

        this.availableVehicleTypes = VehicleType.getAll();

        if (params.teams)
        {
            this.teamsFilterService.selectedTeamIds = params.teams?.split(",");
        }

        this.teamsFilter = this.teamsFilterService.selectedTeamIds;

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
        this.pickupNearbyPosition = undefined;
        if (this.pickupNearbyOperation != null)
        {
            this.pickupNearbyOperation.abort();
        }

        if (this.pickupNearbyAddress != null)
        {
            this.pickupNearbyOperation = new Operation(async signal =>
            {
                try
                {
                    const location = await this._addressService.getLocation(this.pickupNearbyAddress!);
                    this.pickupNearbyPosition = location.position;
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
            availableColumns: Object.keys(RouteListViewColumn.values).filter(slug => slug !== "unknown").map(slug => new RouteListViewColumn(slug as any)),
            selectedColumns: this.columns
        };

        const selectedColumns = await this._modalService.open(SelectColumnsPanel, model).promise;

        if (selectedColumns != null)
        {
            localStorage.setItem("route-columns", JSON.stringify(selectedColumns));

            this.customColumns = selectedColumns as RouteListViewColumn[];
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
    protected update(newValue?: any, oldValue?: any, propertyName?: string): void
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

        const columnSlugs = this.columns.map(c => c.slug);

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

                if (this.assignedDriver !== this.notAssignedDriver)
                {
                    assignedDriver = this.assignedDriver;
                }

                let assignedVehicle: boolean | undefined;

                if (this.assignedVehicle !== this.notAssignedVehicle)
                {
                    assignedVehicle = this.assignedVehicle;
                }

                // tslint:disable-next-line: no-floating-promises
                this._historyHelper.navigate((state: IHistoryState) =>
                {
                    state.params.page = propertyName !== "paging" ? 1 : this.paging.page;
                    state.params.pageSize = this.paging.pageSize;
                    state.params.sortProperty = this.sorting?.property;
                    state.params.sortDirection = this.sorting?.direction;
                    state.params.textFilter = this.textFilter || undefined;
                    state.params.statusFilter = this.statusFilter?.join(",") || undefined;
                    state.params.assignedDriver = this.assignedDriver ? true : undefined;
                    state.params.notAssignedDriver = this.notAssignedDriver ? true : undefined;
                    state.params.assignedVehicle = this.assignedVehicle ? true : undefined;
                    state.params.notAssignedVehicle = this.notAssignedVehicle ? true : undefined;
                    state.params.startTimeFromFilter = this.relativeStartTimeFromFilter != null ? undefined : this.startTimeFromFilter?.toISO();
                    state.params.startTimeToFilter = this.relativeStartTimeToFilter != null ? undefined : this.startTimeToFilter?.toISO();
                    state.params.relativeStartTimeFromFilter = this.relativeStartTimeFromFilter?.toISO();
                    state.params.relativeStartTimeToFilter = this.relativeStartTimeToFilter?.toISO();
                    state.params.relativeStartTimeFromFilterUnit = this.relativeStartTimeFromFilterUnit;
                    state.params.relativeStartTimeToFilterUnit = this.relativeStartTimeToFilterUnit;
                    state.params.teams = this.teamsFilterService.selectedTeamIds;
                    state.params.tagsFilter = this.tagsFilter?.join(",") || undefined;
                    state.params.orderedVehicleTypesFilter = this.orderedVehicleTypesFilter?.map(vt => vt.slug).join(",") || undefined;
                    // TODO: Add "Pickup nearby" filter
                    state.params.owners = this.legacyOwnerIdsFilter?.join(",");
                    state.params.createdTimeFromFilter = this.createdTimeFromFilter?.toISO();
                    state.params.createdTimeToFilter = this.createdTimeToFilter?.toISO();
                },
                { trigger: false, replace: true });

                const result = await this._routeService.getAll(
                    {
                        statuses: this.statusFilter,
                        searchQuery: this.textFilter,
                        tagsAllMatching: this.tagsFilter,
                        startTimeFrom: this.startTimeFromFilter,
                        startTimeTo: this.useRelativeStartTimeToFilter ? this.startTimeToFilter : this.startTimeToFilter?.endOf("day"),
                        createdTimeFrom: this.createdTimeFromFilter,
                        createdTimeTo: this.createdTimeToFilter?.endOf("day"),
                        assignedDriver: assignedDriver,
                        assignedVehicle: assignedVehicle,
                        pickupNearby: (this.pickupNearbyPosition != null) ? { position: this.pickupNearbyPosition, precision: 3 } : undefined,
                        teams: this.teamsFilterService.selectedTeamIds,
                        orderedVehicleTypes: this.orderedVehicleTypesFilter?.map(vt => vt.id),
                        legacyOwnerIds: this.legacyOwnerIdsFilter
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

        if (this.useRelativeStartTimeFromFilter && propertyName !== "relativeStartTimeFromFilterUnit")
        {
            const nowOrStartOfToday = this.relativeStartTimeFromFilterUnit === "days" ? now.startOf("day") : now;

            this.startTimeFromFilter = this.relativeStartTimeFromFilter != null ? nowOrStartOfToday.plus(this.relativeStartTimeFromFilter) : undefined;
        }
        else if (this.relativeStartTimeFromFilter != null)
        {
            this.relativeStartTimeFromFilter = undefined;
            this.startTimeFromFilter = undefined;
        }

        if (this.useRelativeStartTimeToFilter && propertyName !== "relativeStartTimeToFilterUnit")
        {
            const nowOrEndOfToday = this.relativeStartTimeToFilterUnit === "days" ? now.endOf("day") : now;

            this.startTimeToFilter = this.relativeStartTimeToFilter != null ? nowOrEndOfToday.plus(this.relativeStartTimeToFilter) : undefined;
        }
        else if (this.relativeStartTimeToFilter != null)
        {
            this.relativeStartTimeToFilter = undefined;
            this.startTimeToFilter = undefined;
        }
    }

    /**
     * Gets the current view state, which may be saved as a view preset.
     * @returns The current view state.
     */
    protected getViewState(): any
    {
        return {
            sorting: this.sorting,
            columns: this.columns.map(column => column.slug),
            pageSize: this.paging.pageSize,
            filters:
            {
                textFilter: this.textFilter,
                statusFilter: this.statusFilter,
                assignedDriver: this.assignedDriver,
                notAssignedDriver: this.notAssignedDriver,
                assignedVehicle: this.assignedVehicle,
                notAssignedVehicle: this.notAssignedVehicle,
                startTimeFromFilter: this.useRelativeStartTimeFromFilter ? undefined : this.startTimeFromFilter?.toISO(),
                startTimeToFilter: this.useRelativeStartTimeToFilter ? undefined : this.startTimeToFilter?.toISO(),
                relativeStartTimeFromFilter: this.relativeStartTimeFromFilter?.toISO(),
                relativeStartTimeToFilter: this.relativeStartTimeToFilter?.toISO(),
                relativeStartTimeFromFilterUnit: this.relativeStartTimeFromFilterUnit,
                relativeStartTimeToFilterUnit: this.relativeStartTimeToFilterUnit,
                tagsFilter: this.tagsFilter,
                orderedVehicleTypesFilter: this.orderedVehicleTypesFilter?.map(vt => vt.slug),
                legacyOwnerIdsFilter: this.legacyOwnerIdsFilter,
                createdTimeFromFilter: this.createdTimeFromFilter?.toISO(),
                createdTimeToFilter: this.createdTimeToFilter?.toISO()
            }
        };
    }

    /**
     * Sets the current view state, to match the specified state.
     * @param state The view state to apply.
     */
    protected setViewState(state: any): void
    {
        this.sorting = state.sorting ?? { property: "start-date", direction: "descending" };
        this.customColumns = state.columns.map(slug => new RouteListViewColumn(slug));
        this.paging = { ...this.paging, pageSize: state.pageSize ?? 30 };
        this.textFilter = state.filters.textFilter;
        this.statusFilter = state.filters.statusFilter;
        this.assignedDriver = state.filters.assignedDriver;
        this.notAssignedDriver = state.filters.notAssignedDriver;
        this.assignedVehicle = state.filters.assignedVehicle;
        this.notAssignedVehicle = state.filters.notAssignedVehicle;
        this.startTimeFromFilter = state.filters.startTimeFromFilter != null ? DateTime.fromISO(state.filters.startTimeFromFilter, { setZone: true }) : undefined;
        this.startTimeToFilter = state.filters.startTimeToFilter != null ? DateTime.fromISO(state.filters.startTimeToFilter, { setZone: true }) : undefined;
        this.relativeStartTimeFromFilterUnit = state.filters.relativeStartTimeFromFilterUnit;
        this.relativeStartTimeToFilterUnit = state.filters.relativeStartTimeToFilterUnit;
        this.tagsFilter = state.filters.tagsFilter;
        this.orderedVehicleTypesFilter = state.filters.orderedVehicleTypesFilter?.map(slug => VehicleType.getBySlug(slug));
        this.legacyOwnerIdsFilter = state.filters.legacyOwnerIdsFilter;
        this.createdTimeFromFilter = state.filters.createdTimeFromFilter != null ? DateTime.fromISO(state.filters.createdTimeFromFilter, { setZone: true }) : undefined;
        this.createdTimeToFilter = state.filters.createdTimeToFilter != null ? DateTime.fromISO(state.filters.createdTimeToFilter, { setZone: true }) : undefined;

        this.useRelativeStartTimeFromFilter = state.filters.relativeStartTimeFromFilter != null;
        this.relativeStartTimeFromFilter = state.filters.relativeStartTimeFromFilter ? Duration.fromISO(state.filters.relativeStartTimeFromFilter) : undefined;

        this.useRelativeStartTimeToFilter = state.filters.relativeStartTimeToFilter != null;
        this.relativeStartTimeToFilter = state.filters.relativeStartTimeToFilter ? Duration.fromISO(state.filters.relativeStartTimeToFilter) : undefined;

        this.results = undefined;
        this.update();
    }
}
