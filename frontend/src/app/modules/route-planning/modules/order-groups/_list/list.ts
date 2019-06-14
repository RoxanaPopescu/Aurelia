import { autoinject, observable } from "aurelia-framework";
import { RouteConfig } from "aurelia-router";
import { Operation, ISorting, IPaging } from "shared/types";
import { IScroll } from "shared/framework";
import { OrderGroupService } from "app/model/services/route-plan";
import { OrderGroupInfo } from "app/model/entities/route-plan";

/**
 * Represents the page.
 */
@autoinject
export class ListPage
{
    /**
     * Creates a new instance of the class.
     * @param orderGroupsService The `OrderGroupService` instance.
     */
    public constructor(orderGroupsService: OrderGroupService)
    {
        this._orderGroupsService = orderGroupsService;
        this._constructed = true;
    }

    private readonly _orderGroupsService: OrderGroupService;
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
    protected orderGroupCount: number | undefined;

    /**
     * The items to present in the table.
     */
    protected orderGroups: OrderGroupInfo[];

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
            const result = await this._orderGroupsService.getAll(
                this.sorting,
                this.paging,
                signal);

            // Update the state.
            this.orderGroups = result.orderGroups;
            this.orderGroupCount = result.orderGroupCount;

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
