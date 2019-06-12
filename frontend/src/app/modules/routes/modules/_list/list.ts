import { autoinject, observable } from "aurelia-framework";
import { RouteConfig } from "aurelia-router";
import { Operation, ISorting, IPaging } from "shared/types";
import { IScroll } from "shared/framework";
import { RouteService } from "app/model/services/route";
import { RouteInfo } from "app/model/entities/route/list";
import { RouteStatusSlug } from "app/model/entities/route";

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
        });
    }
}
