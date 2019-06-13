import { autoinject, observable } from "aurelia-framework";
import { RouteConfig } from "aurelia-router";
import { Operation, ISorting, IPaging } from "shared/types";
import { IScroll } from "shared/framework";
import { RoutePlanSettingsService } from "app/model/services/route-plan";
import { RoutePlanSettingsInfo } from "app/model/entities/route-plan";

/**
 * Represents the page.
 */
@autoinject
export class ListPage
{
    /**
     * Creates a new instance of the class.
     * @param routeSettingsService The `RoutePlanSettingsService` instance.
     */
    public constructor(routeSettingsService: RoutePlanSettingsService)
    {
        this._routeSettingsService = routeSettingsService;
        this._constructed = true;
    }

    private readonly _routeSettingsService: RoutePlanSettingsService;
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
        property: "created",
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
     * The total number of items matching the query, or undefined if unknown.
     */
    protected settingCount: number | undefined;

    /**
     * The items to present in the table.
     */
    protected settings: RoutePlanSettingsInfo[];

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
            const result = await this._routeSettingsService.getAll(
                this.sorting,
                this.paging,
                signal);

            // Update the state.
            this.settings = result.settings;
            this.settingCount = result.settingCount;

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
