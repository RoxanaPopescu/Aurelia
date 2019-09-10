import { autoinject, observable } from "aurelia-framework";
import { ISorting, IPaging, SortingDirection } from "shared/types";
import { Operation } from "shared/utilities";
import { HistoryHelper, IHistoryState } from "shared/infrastructure";
import { IScroll } from "shared/framework";
import { RouteService, RouteStatusSlug, RouteInfo } from "app/model/route";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    page?: number;
    pageSize?: number;
    sortProperty?: string;
    sortDirection?: SortingDirection;
}

/**
 * Represents the page.
 */
@autoinject
export class DataTablePage
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

    // ----------

    /**
     * The appearance to use for the table.
     */
    protected tableAppearance = "rows";

    /**
     * The selection mode to use for the table.
     */
    protected tableSelection = "none";

    /**
     * The accent color to use for the table.
     */
    protected tableRowAccent = "neutral";

    /**
     * The row type to use for the table.
     */
    protected rowType = "normal";

    /**
     * The slug identifying the expanded route.
     */
    protected expandedRouteSlug: string | undefined;

    // ----------

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
        pageSize: 20
    };

    /**
     * The name identifying the selected status tab.
     */
    @observable({ changeHandler: "update" })
    protected statusFilter: RouteStatusSlug | undefined = "requested";

    /**
     * The text in the filter text input.
     */
    @observable({ changeHandler: "update" })
    protected textFilter: string | undefined;

    /**
     * The total number of items matching the query, or undefined if unknown.
     */
    protected routeCount: number | undefined;

    /**
     * The items to present in the table.
     */
    protected routes: RouteInfo[];

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
            // Fetch the data.
            const result = await this._routeService.getAll(
                this.statusFilter,
                this.textFilter,
                this.sorting,
                this.paging,
                signal);

            // Update the state.
            this.routes = result.routes;
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
            },
            { trigger: false, replace: true });
        });
    }

    // ----------

    /**
     * Called when a row is clicked.
     * @param route The route represented by the row.
     */
    protected onRowClick(route: any): boolean
    {
        console.log("row click:", route.slug);

        this.expandedRouteSlug = route.slug;

        return true;
    }

    /**
     * Called when a row is selected or deselected.
     * @param route The route represented by the row.
     * @param value True if the row is selected, otherwise false.
     */
    protected onToggleRow(route: any, value: boolean): boolean
    {
        console.log("toggle row:", value, route.slug);

        return true;
    }

    /**
     * Called when all rows are selected or deselected.
     * @param value True if the rows are selected, otherwise false.
     */
    protected onToggleAll(value: boolean): boolean
    {
        console.log("toggle all:", value);

        return true;
    }
}
