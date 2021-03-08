import { autoinject, observable } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { Operation } from "shared/utilities";
import { Modal, IScroll } from "shared/framework";
import { IPaging, ISorting } from "shared/types";
import { OrderInfo, OrderService } from "app/model/order";
import { DateTime } from "luxon";

@autoinject
export class SelectOrderPanel
{
    /**
     * Creates a new instance of the class.
     * @param modal The `Modal` instance representing the modal.
     * @param orderService The `OrderService` instance.
     */
    public constructor(modal: Modal, orderService: OrderService)
    {
        this._modal = modal;
        this._orderService = orderService;
        this._constructed = true;
    }

    private readonly _modal: Modal;
    private readonly _orderService: OrderService;
    private _result: OrderInfo | undefined;
    private readonly _constructed;

    /**
     * The searchg query, or undefined if ne search query is entered.
     */
    @observable({ changeHandler: "update" })
    protected searchQuery: string | undefined;

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
        pageSize: 30
    };

    /**
     * If it failed loading.
     */
    protected failed: boolean = false;

    /**
     * The scroll manager for the page.
     */
    protected scroll: IScroll;

    /**
     * The most recent update operation.
     */
    protected updateOperation: Operation;

    /**
     * The available orders.
     */
    protected results: OrderInfo[] | undefined;

    /**
     * Called by the framework when the modal is activated.
     * @param model The route to add the driver too, if undefined it will not be assigned.
     */
    public activate(model?: {  }): void
    {
        this.update();
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The selected driver, or undefined if cancelled.
     */
    public async deactivate(): Promise<OrderInfo | undefined>
    {
        // Abort any existing operation.
        if (this.updateOperation != null)
        {
            this.updateOperation.abort();
        }

        return this._result;
    }

    /**
     * Called when a order in the list of orders is clicked.
     * Returns the order and closes the modal.
     */
    protected async onOrderClick(order: OrderInfo): Promise<void>
    {
        this._result = order;
        await this._modal.close();
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
                try
                {
                    this.failed = false;

                    const result = await this._orderService.getAll(
                        DateTime.local().minus({ day: 1 }),
                        DateTime.local().plus({ day: 2 }),
                        ["ready"],
                        undefined,
                        undefined,
                        this.searchQuery,
                        this.sorting,
                        this.paging,
                        signal);

                    // Update the state.
                    this.results = result.orders;
                }
                catch (error)
                {
                    this.failed = true;
                    Log.error("An error occurred while loading the list.\n", error);
                }
            });
    }
}
