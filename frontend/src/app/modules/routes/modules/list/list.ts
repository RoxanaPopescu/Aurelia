import { autoinject, observable } from "aurelia-framework";
import { ISorting, IPaging, SortingDirection } from "shared/types";
import { Operation } from "shared/utilities";
import { HistoryHelper, IHistoryState, Log } from "shared/infrastructure";
import { IScroll } from "shared/framework";
import { RouteService, RouteInfo, RouteStatusSlug } from "app/model/route";
import { DateTime } from "luxon";

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
     * @param historyHelper The `HistoryHelper` instance.
     */
    public constructor(routeService: RouteService, historyHelper: HistoryHelper)
    {
        this._routeService = routeService;
        this._historyHelper = historyHelper;
        this._constructed = true;
    }

    private readonly _routeService: RouteService;
    private readonly _historyHelper: HistoryHelper;
    private readonly _constructed;

    /**
     * The scroll manager for the page.
     */
    protected scroll: IScroll;

    /**
     * The most recent update operation.
     */
    protected updateOperation: Operation;

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
     * The total number of items matching the query, or undefined if unknown.
     */
    protected routeCount: number | undefined;

    /**
     * The items to present in the table.
     */
    protected results: RouteInfo[];

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     * @returns A promise that will be resolved when the module is activated.
     */
    public async activate(params: IRouteParams): Promise<void>
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
        this.update();
    }

    /**
     * Called by the framework when the module is deactivated.
     * @returns A promise that will be resolved when the module is activated.
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
        window.open(route.driverListUrl, '_blank');
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

            try {
                let assignedDriver: boolean | undefined;
                if (this.assignedDriver != this.notAssignedDriver) {
                    assignedDriver = this.assignedDriver
                }

                let assignedVehicle: boolean | undefined;
                if (this.assignedVehicle != this.notAssignedVehicle) {
                    assignedVehicle = this.assignedVehicle
                }

                const result = await this._routeService.getAll(
                    {
                        statuses: this.statusFilter,
                        searchQuery: this.searchQuery,
                        tagsAllMatching: this.tagsFilter,
                        startTimeFrom: this.startTimeFromFilter,
                        startTimeTo: this.startTimeToFilter,
                        createdTimeFrom: this.createdTimeFromFilter,
                        createdTimeTo: this.createdTimeToFilter,
                        assignedDriver: assignedDriver,
                        assignedVehicle: assignedVehicle
                    },
                    this.sorting,
                    this.paging,
                    false,
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
                    state.params.sortProperty = this.sorting ? this.sorting.property : undefined;
                    state.params.sortDirection = this.sorting ? this.sorting.direction : undefined;
                    state.params.statusFilter = this.statusFilter?.join(",");
                    state.params.searchQuery = this.searchQuery || undefined;
                    state.params.tagsFilter = this.tagsFilter.length > 0 ? this.tagsFilter.join(",") : undefined;
                    state.params.assignedDriver = this.assignedDriver ? true : undefined;
                    state.params.notAssignedDriver = this.notAssignedDriver ? true : undefined;
                    state.params.assignedVehicle = this.assignedVehicle ? true : undefined;
                    state.params.notAssignedVehicle = this.notAssignedVehicle ? true : undefined;
                },
                { trigger: false, replace: true });
            } catch (error) {
                this.failed = true;
                Log.error("An error occurred while loading the list.\n", error);
            }
        });
    }
}
