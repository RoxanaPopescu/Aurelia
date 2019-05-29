import { autoinject, observable } from "aurelia-framework";
import { RouteConfig } from "aurelia-router";
import { RouteService } from "app/model/services/route";
import { RouteInfo } from "app/model/entities/route/list";
import { IDataTableSorting } from "shared/framework";
import { RouteStatusSlug } from "app/model/entities/route";
import { AbortError } from "shared/types";

/**
 * Represents the page.
 */
@autoinject
export class ListPage
{
    /**
     * Creates a new instance of the class.
     * @param routeService The `RouteService` instance.
     */
    public constructor(routeService: RouteService)
    {
        this._routeService = routeService;
    }

    private readonly _routeService: RouteService;

    /**
     * The abort controller for the current operation,
     * or undefined if no operation is pending.
     */
    protected abortController: AbortController | undefined;

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

    /**
     * The sorting to use for the table.
     */
    @observable({ changeHandler: "fetchData" })
    protected sorting: IDataTableSorting =
    {
        property: "reference",
        direction: "descending"
    };

    /**
     * The name identifying the selected status tab.
     */
    @observable({ changeHandler: "fetchData" })
    protected statusFilter: RouteStatusSlug = "requested";

    /**
     * The text in the filter text input.
     */
    @observable({ changeHandler: "fetchData" })
    protected textFilter: string;

    /**
     * The current page number, starting from 1.
     */
    @observable({ changeHandler: "fetchData" })
    protected page: number = 1;

    /**
     * The max number of items to show on a page, or undefined to disable this option.
     */
    @observable({ changeHandler: "fetchData" })
    protected pageSize: number = 20;

    /**
     * The total number of items in the list, or undefined if unknown.
     */
    protected routeCount: number | undefined;

    /**
     * The routes to present in the list.
     */
    protected routes: RouteInfo[];

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     * @param routeConfig The route configuration.
     * @returns A promise that will be resolved when the module is activated.
     */
    public async activate(params: never, routeConfig: RouteConfig): Promise<void>
    {
        // tslint:disable-next-line: no-floating-promises
        this.fetchData();
    }

    protected async fetchData(): Promise<void>
    {
        // Return if the constructor has not run yet.
        // This is needed because the `observable` decorator calls the change handler before the constructor has run.
        if (this._routeService == null)
        {
            return;
        }

        // Create the abort controller for the new fetch.
        const abortController = new AbortController();

        try
        {
            // Abort any existing fetch.
            if (this.abortController != null)
            {
                this.abortController.abort();
            }

            // Set the abort controller, indicating that the page is busy.
            this.abortController = abortController;

            // Fetch the data.
            const result = await this._routeService.getAll(
                this.sorting ? this.sorting.property : "reference",
                this.sorting ? this.sorting.direction : "descending",
                this.page,
                this.pageSize,
                this.statusFilter,
                this.textFilter,
                this.abortController.signal);

            // Update the state.
            this.routes = result.routes;
            this.routeCount = result.routeCount;
        }
        catch (error)
        {
            // Throw if not caused by an abort.
            if (!(error instanceof AbortError))
            {
                throw error;
            }
        }
        finally
        {
            // Clear abort controller, indicating that the page is ready.
            if (this.abortController === abortController)
            {
                this.abortController = undefined;
            }
        }
    }

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
