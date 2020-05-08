import { autoinject, observable } from "aurelia-framework";
import { ISorting, IPaging, SortingDirection } from "shared/types";
import { Operation } from "shared/utilities";
import { HistoryHelper, IHistoryState, Log } from "shared/infrastructure";
import { IScroll } from "shared/framework";
import { RouteService, RouteInfo } from "app/model/route";
import { RouteStatusListSlug } from "app/model/route/entities/route-status-list";
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
    statusFilter?: RouteStatusListSlug;
    textFilter?: string;
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
        property: "status",
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
    protected statusFilter: RouteStatusListSlug = "requested";

    /**
     * The text in the search text input.
     */
    @observable({ changeHandler: "update" })
    protected searchQuery: string | undefined;

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
        this.statusFilter = params.statusFilter || this.statusFilter;
        this.searchQuery = params.textFilter || this.searchQuery;

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
                // Fetch the data.
                const result = await this._routeService.getAll(
                    {
                        status: this.statusFilter,
                        searchQuery: this.searchQuery,
                        tags: this.tagsFilter,
                        startTimeFrom: this.startTimeFromFilter,
                        startTimeTo: this.startTimeToFilter
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
                    state.params.sortProperty = this.sorting ? this.sorting.property : undefined;
                    state.params.sortDirection = this.sorting ? this.sorting.direction : undefined;
                    state.params.statusFilter = this.statusFilter;
                    state.params.searchQuery = this.searchQuery || undefined;
                },
                { trigger: false, replace: true });
            } catch (error) {
                this.failed = true;
                Log.error("An error occurred while loading the list.\n", error);
            }
        });
    }
}
