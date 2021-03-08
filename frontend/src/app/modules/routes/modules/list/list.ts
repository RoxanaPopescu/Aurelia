import { autoinject, observable, computedFrom } from "aurelia-framework";
import { ISorting, IPaging, SortingDirection } from "shared/types";
import { Operation } from "shared/utilities";
import { HistoryHelper, IHistoryState, Log } from "shared/infrastructure";
import { IScroll, ModalService } from "shared/framework";
import { RouteService, RouteInfo, RouteStatusSlug, RouteAssignmentService } from "app/model/route";
import { DateTime } from "luxon";
import { RouteListColumn } from "app/model/route/entities/route-list-column";
import { AssignDriverPanel } from "../../modals/assign-driver/assign-driver";
import { AssignVehiclePanel } from "../../modals/assign-vehicle/assign-vehicle";
import { AssignFulfillerPanel } from "../../modals/assign-fulfiller/assign-fulfiller";
import { SelectColumnsPanel } from "./modals/select-columns/select-columns";
import { Address, Position } from "app/model/shared";
import { AddressService } from "app/components/address-input/services/address-service/address-service";
import { IdentityService, moverOrganizationId } from "app/services/identity";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    page?: number;
    pageSize?: number;
    sortProperty?: string;
    sortDirection?: SortingDirection;
    searchQuery?: string;
    statusFilter?: RouteStatusSlug;
    tagsFilter?: string;
    assignedDriver?: boolean;
    notAssignedDriver?: boolean;
    assignedVehicle?: boolean;
    notAssignedVehicle?: boolean;
    startTimeFromFilter?: string;
    startTimeToFilter?: string;
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
     * @param identityService The `IdentityService` instance.
     */
    public constructor(
        routeService: RouteService,
        addressService: AddressService,
        routeAssignmentService: RouteAssignmentService,
        modalService: ModalService,
        historyHelper: HistoryHelper,
        identityService: IdentityService)
    {
        this._routeService = routeService;
        this._modalService = modalService;
        this._routeAssignmentService = routeAssignmentService;
        this._historyHelper = historyHelper;
        this._addressService = addressService;
        this._identityService = identityService;
        this._constructed = true;

        const localData = localStorage.getItem("route-columns");

        if (localData != null)
        {
            const columnsObject = JSON.parse(localData);
            const customColumns: RouteListColumn[] = [];
            for (const slug of columnsObject)
            {
                if (Object.keys(RouteListColumn.values).includes(slug))
                {
                    customColumns.push(new RouteListColumn(slug));
                }
            }

            this.customColumns = customColumns;
        }
    }

    private readonly _routeService: RouteService;
    private readonly _modalService: ModalService;
    private readonly _addressService: AddressService;
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
     * The custom grid column widths calculated from the columns
     */
    @computedFrom("columns")
    protected get tableStyle(): any
    {
        let size = "";

        for (const column of this.columns)
        {
            if (column.column !== "not-added")
            {
                size += `${column.columnSize} `;
            }
        }

        return { "grid-template-columns": `${size} min-content` };
    }

    /**
     * The custom columns the user has selected
     */
    protected customColumns: RouteListColumn[] | undefined;

    /**
     * The current columns to show in the list
     */
    @computedFrom("customColumns")
    protected get columns(): RouteListColumn[]
    {
        return this.customColumns ?? [
            new RouteListColumn("slug"),
            new RouteListColumn("reference"),
            new RouteListColumn("start-date"),
            new RouteListColumn("start-address"),
            new RouteListColumn("tags"),
            new RouteListColumn("stop-count"),
            new RouteListColumn("vehicle-type"),
            new RouteListColumn("status"),
            new RouteListColumn("driver-list")
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
    protected searchQuery: string | undefined;

    /**
     * Ff the driver is assigned
     */
    @observable({ changeHandler: "update" })
    protected assignedDriver: boolean = false;

    /**
     * If the driver is not assigned
     */
    @observable({ changeHandler: "update" })
    protected notAssignedDriver: boolean = false;

    /**
     * The if the vehicle is assigned
     */
    @observable({ changeHandler: "update" })
    protected assignedVehicle: boolean = false;

    /**
     * The if the vehicle is assigned
     */
    @observable({ changeHandler: "update" })
    protected notAssignedVehicle: boolean = false;

    /**
     * The order tags for which orders should be shown.
     */
    @observable({ changeHandler: "update" })
    protected tagsFilter: any[] = [];

    /**
     * The min date for whichorders should be shown.
     */
    @observable({ changeHandler: "update" })
    protected startTimeFromFilter: DateTime | undefined;

    /**
     * The min date for which orders should be shown.
     */
    @observable({ changeHandler: "update" })
    protected startTimeToFilter: DateTime | undefined;

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
     * The legacy owner ids to show, only used by Mover Transport in a transition phase.
     */
    @observable({ changeHandler: "update" })
    protected legacyOwnerIdsFilter: any[] = [];

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
        return legacyOrganizationIds.includes(identity.outfit.id);
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
        this.paging.page = params.page || this.paging.page;
        this.paging.pageSize = params.pageSize || this.paging.pageSize;
        this.sorting.property = params.sortProperty || this.sorting.property;
        this.sorting.direction = params.sortDirection || this.sorting.direction;
        this.statusFilter = params.statusFilter ? params.statusFilter.split(",") as any : this.statusFilter;
        this.searchQuery = params.searchQuery || this.searchQuery;
        this.tagsFilter = params.tagsFilter?.split(",") || this.tagsFilter;
        this.assignedDriver = params.assignedDriver != null ? Boolean(params.assignedDriver) : this.assignedDriver;
        this.notAssignedDriver = params.notAssignedDriver != null ? Boolean(params.notAssignedDriver) : this.notAssignedDriver;
        this.assignedVehicle = params.assignedVehicle != null ? Boolean(params.assignedVehicle) : this.assignedVehicle;
        this.notAssignedVehicle = params.notAssignedVehicle != null ? Boolean(params.notAssignedVehicle) : this.notAssignedVehicle;
        this.startTimeFromFilter = params.startTimeFromFilter ? DateTime.fromISO(params.startTimeFromFilter, { setZone: true }) : undefined;
        this.startTimeToFilter = params.startTimeToFilter ? DateTime.fromISO(params.startTimeToFilter, { setZone: true }) : undefined;
        this.createdTimeFromFilter = params.createdTimeFromFilter ? DateTime.fromISO(params.createdTimeFromFilter, { setZone: true }) : undefined;
        this.createdTimeToFilter = params.createdTimeToFilter ? DateTime.fromISO(params.createdTimeToFilter, { setZone: true }) : undefined;

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
     * Called when the `Assign fulfiller` button is clicked.
     * Opens the panel for assigning a fulfiller to a route, and once assigned, re-fetches the route.
     */
    protected async onAssignFulfillerClick(route: RouteInfo): Promise<void>
    {
        const fulfiller = await this._modalService.open(
            AssignFulfillerPanel,
            { route: route, assignOnSelect: false }
        ).promise;

        if (fulfiller != null)
        {
            await this._routeAssignmentService.assignFulfiller(route, fulfiller);
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
    protected async onAssignVehicleClick(route: RouteInfo): Promise<void>
    {
        const vehicle = await this._modalService.open(
            AssignVehiclePanel,
            { route: route, assignOnSelect: false }
        ).promise;

        if (vehicle != null)
        {
            await this._routeAssignmentService.assignVehicle(route, vehicle);
        }
    }

    /**
     * Called when the `Assign driver` button is clicked.
     * Opens the panel for assigning a driver to a route, and once assigned, re-fetches the route.
     */
    protected async onAssignDriverClick(route: RouteInfo): Promise<void>
    {
        const driver = await this._modalService.open(
            AssignDriverPanel,
            { route: route, assignOnSelect: false }
        ).promise;

        if (driver != null)
        {
            await this._routeAssignmentService.assignDriver(route, driver);
        }
    }

    /**
     * Called when the `Select columns` button is clicked.
     * Opens the panel for selecting the columns to see.
     */
    protected async onSelectColumnsClick(): Promise<void>
    {
        const columns = await this._modalService.open(
            SelectColumnsPanel,
            this.columns
        ).promise;

        if (columns != null)
        {
            this.customColumns = columns;
            this.results = undefined;
            this.update();
        }
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

        // Abort any existing operation.
        if (this.updateOperation != null)
        {
            this.updateOperation.abort();
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

                const result = await this._routeService.getAll(
                    {
                        statuses: this.statusFilter,
                        searchQuery: this.searchQuery,
                        tagsAllMatching: this.tagsFilter,
                        startTimeFrom: this.startTimeFromFilter,
                        startTimeTo: this.startTimeToFilter?.endOf("day"),
                        createdTimeFrom: this.createdTimeFromFilter,
                        createdTimeTo: this.createdTimeToFilter?.endOf("day"),
                        assignedDriver: assignedDriver,
                        assignedVehicle: assignedVehicle,
                        pickupNearby: (this.pickupNearbyPosition != null) ? { position: this.pickupNearbyPosition, precision: 3 } : undefined,
                        legacyOwnerIds: this.legacyOwnerIdsFilter
                    },
                    {
                        owner: this.columns.map(c => c.slug).includes("owner"),
                        vehicle: this.columns.map(c => c.slug).includes("vehicle"),
                        fulfiller: this.columns.map(c => c.slug).includes("fulfiller"),
                        driver: this.columns.map(c => c.slug).includes("driver"),
                        tags: this.columns.map(c => c.slug).includes("tags"),
                        criticality: this.columns.map(c => c.slug).includes("criticality"),
                        estimates: this.columns.map(c => c.slug).includes("estimated-time-frame"),
                        delayedStops: this.columns.map(c => c.slug).includes("delayed-stops"),
                        stops: this.columns.map(c => c.slug).includes("distance")
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
                this.scroll.reset();

                // tslint:disable-next-line: no-floating-promises
                this._historyHelper.navigate((state: IHistoryState) =>
                {
                    state.params.page = this.paging.page;
                    state.params.pageSize = this.paging.pageSize;
                    state.params.sortProperty = this.sorting?.property;
                    state.params.sortDirection = this.sorting?.direction;
                    state.params.statusFilter = this.statusFilter?.join(",") || undefined;
                    state.params.searchQuery = this.searchQuery || undefined;
                    state.params.tagsFilter = this.tagsFilter?.join(",") || undefined;
                    state.params.assignedDriver = this.assignedDriver ? true : undefined;
                    state.params.notAssignedDriver = this.notAssignedDriver ? true : undefined;
                    state.params.assignedVehicle = this.assignedVehicle ? true : undefined;
                    state.params.notAssignedVehicle = this.notAssignedVehicle ? true : undefined;
                    state.params.startTimeFromFilter = this.startTimeFromFilter?.toISO();
                    state.params.startTimeToFilter = this.startTimeToFilter?.toISO();
                    state.params.createdTimeFromFilter = this.createdTimeFromFilter?.toISO();
                    state.params.createdTimeToFilter = this.createdTimeToFilter?.toISO();
                },
                { trigger: false, replace: true });
            }
            catch (error)
            {
                this.failed = true;
                Log.error("An error occurred while loading the list.\n", error);
            }
        });
    }
}
