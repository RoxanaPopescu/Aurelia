import { autoinject, observable } from "aurelia-framework";
import { RouteConfig } from "aurelia-router";
import { RoutePlanService } from "app/model/services/route-plan";
import { Operation, ISorting } from "shared/types";
import { RoutePlanInfo } from "app/model/entities/route-plan";

/**
 * Represents the page.
 */
@autoinject
export class ListPage
{
    /**
     * Creates a new instance of the class.
     * @param routePlanService The `RoutePlanService` instance.
     */
    public constructor(routePlanService: RoutePlanService)
    {
        this._routePlanService = routePlanService;
        this._constructed = true;
    }

    private readonly _routePlanService: RoutePlanService;
    private readonly _constructed;

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
    protected planCount: number | undefined;

    /**
     * The route plans to present in the list.
     */
    protected plans: RoutePlanInfo[];

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
    protected update(newValue?: any, oldValue?: any, propertyName?): void
    {
        // Return if the object is not constructed.
        // This is needed because the `observable` decorator calls the change handler when the
        // initial property value is set, which happens before the constructor is called.
        if (!this._constructed)
        {
            return;
        }

        if (propertyName === "sorting")
        {
            this.page = 1;
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
            const result = await this._routePlanService.getAll(
                this.sorting,
                { page: this.page, pageSize: this.pageSize },
                signal);

            // Update the state.
            this.plans = result.plans;
            this.planCount = result.planCount;
        });
    }
}
