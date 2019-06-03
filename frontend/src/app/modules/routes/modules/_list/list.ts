import { autoinject, observable } from "aurelia-framework";
import { RouteConfig } from "aurelia-router";
import { RouteService } from "app/model/services/route";
import { RouteInfo } from "app/model/entities/route/list";
import { RouteStatusSlug } from "app/model/entities/route";
import { Operation, ISorting } from "shared/types";

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
        this._constructed = true;
    }

    private readonly _routeService: RouteService;
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
     * The most recent update operation.
     */
    protected updateOperation: Operation;

    /**
     * The sorting to use for the table.
     */
    @observable({ changeHandler: "update" })
    protected sorting: ISorting =
    {
        property: "reference",
        direction: "descending"
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
     * The current page number, starting from 1.
     */
    @observable({ changeHandler: "update" })
    protected page: number = 1;

    /**
     * The max number of items to show on a page, or undefined to disable this option.
     */
    @observable({ changeHandler: "update" })
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
    public async activate(params: {}, routeConfig: RouteConfig): Promise<void>
    {
        this.update();
    }

    /**
     * Updates the page by fetching the latest data.
     */
    protected update(): void
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
                { page: this.page, pageSize: this.pageSize },
                signal);

            // Update the state.
            this.routes = result.routes;
            this.routeCount = result.routeCount;
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
