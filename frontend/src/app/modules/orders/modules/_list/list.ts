import { autoinject, observable } from "aurelia-framework";
import { RouteConfig } from "aurelia-router";
import { Operation, ISorting, IPaging } from "shared/types";
import { IScroll } from "shared/framework";
import { OrderService } from "app/model/services/order";
import { OrderInfo } from "app/model/entities/order/list";
import { OrderStatusSlug } from "app/model/entities/order";

/**
 * Represents the page.
 */
@autoinject
export class ListPage
{
    /**
     * Creates a new instance of the class.
     * @param orderService The `RouteService` instance.
     */
    public constructor(orderService: OrderService)
    {
        this._orderService = orderService;
        this._constructed = true;
    }

    private readonly _orderService: OrderService;
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
        property: "pickup-date",
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
    protected statusFilter: OrderStatusSlug | undefined;

    /**
     * The text in the filter text input.
     */
    @observable({ changeHandler: "update" })
    protected textFilter: string | undefined;

    /**
     * The total number of items matching the query, or undefined if unknown.
     */
    protected orderCount: number | undefined;

    /**
     * The items to present in the table.
     */
    protected orders: OrderInfo[];

    /**
     * Called by the framework when the module is activated.
     * @param params The order parameters from the URL.
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
            const result = await this._orderService.getAll(
                this.statusFilter,
                this.textFilter,
                this.sorting,
                this.paging,
                signal);

            // Update the state.
            this.orders = result.orders;
            this.orderCount = result.orderCount;

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
