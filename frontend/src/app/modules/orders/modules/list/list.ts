import { autoinject, observable } from "aurelia-framework";
import { DateTime } from "luxon";
import { ISorting, IPaging, SortingDirection } from "shared/types";
import { Operation } from "shared/utilities";
import { HistoryHelper, IHistoryState, Log } from "shared/infrastructure";
import { IScroll, ModalService, ToastService } from "shared/framework";
import { AgreementService } from "app/model/agreement";
import { OrderService, OrderInfo, OrderStatusSlug } from "app/model/order";
import { Consignor } from "app/model/outfit";
import createdToast from "./resources/strings/created-toast.json";
import { CreateRoutePanel } from "./modals/create-route/create-route";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    page?: number;
    pageSize?: number;
    sortProperty?: string;
    sortDirection?: SortingDirection;
    statusFilter?: string;
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
     * @param orderService The `RouteService` instance.
     * @param historyHelper The `HistoryHelper` instance.
     * @param agreementService The `AgreementService` instance.
     */
    public constructor(
        orderService: OrderService,
        historyHelper: HistoryHelper,
        modalService: ModalService,
        toastService: ToastService,
        agreementService: AgreementService)
    {
        this._orderService = orderService;
        this._historyHelper = historyHelper;
        this._modalService = modalService;
        this._toastService = toastService;
        this._agreementService = agreementService;
        this._constructed = true;
    }

    private readonly _orderService: OrderService;
    private readonly _historyHelper: HistoryHelper;
    private readonly _modalService: ModalService;
    private readonly _toastService: ToastService;
    private readonly _agreementService: AgreementService;
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
     * The text in the filter text input.
     */
    @observable({ changeHandler: "update" })
    protected textFilter: string | undefined;

    /**
     * The name identifying the selected status tab.
     */
    @observable({ changeHandler: "update" })
    protected statusFilter: OrderStatusSlug[] | undefined;

    /**
     * The consignors for which orders should be shown.
     */
    @observable({ changeHandler: "update" })
    protected consignorFilter: any[] = [];

    /**
     * The min date for whichorders should be shown.
     */
    @observable({ changeHandler: "update" })
    protected fromDateFilter: DateTime | undefined;

    /**
     * The min date for which orders should be shown.
     */
    @observable({ changeHandler: "update" })
    protected toDateFilter: DateTime | undefined;

    /**
     * If it failed loading.
     */
    protected failed: boolean = false;

    /**
     * The total number of items matching the query, or undefined if unknown.
     */
    protected orderCount: number | undefined;

    /**
     * The items to present in the table.
     */
    protected orders: OrderInfo[];

    /**
     * The items selected in the table
     */
    protected selectedOrders: OrderInfo[] = [];

    /**
     * The consignors to show in the filter.
     */
    protected consignors: Consignor[];

    /**
     * Called by the framework when the module is activated.
     * @param params The order parameters from the URL.
     * @returns A promise that will be resolved when the module is activated.
     */
    public activate(params: IRouteParams): void
    {
        this.paging.page = params.page || this.paging.page;
        this.paging.pageSize = params.pageSize || this.paging.pageSize;
        this.sorting.property = params.sortProperty || this.sorting.property;
        this.sorting.direction = params.sortDirection || this.sorting.direction;
        this.statusFilter = params.statusFilter ? params.statusFilter.split(",") as any : this.statusFilter;
        this.textFilter = params.textFilter || this.textFilter;

        this.update();

        // Execute tasks that should not block rendering.

        // tslint:disable-next-line: no-floating-promises
        (async () =>
        {
            const agreements = await this._agreementService.getAll();
            this.consignors = agreements.agreements.filter(c => c.type.slug === "consignor");

        })();
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
     * Called when the selection of a row is toggled.
     */
    protected onRowToggle(order: OrderInfo, selected: boolean): void
    {
        if (selected)
        {
            this.selectedOrders.push(order);
        }
        else
        {
            this.selectedOrders.splice(this.selectedOrders.findIndex(r => r.id === order.id), 1);
        }

        this.selectedOrders = this.selectedOrders.slice();
    }

    /**
     * Checks if the order is selected.
     * @param order The order to check.
     * @returns a boolean to determine the result.
     */
    protected orderSelected(order: OrderInfo): boolean
    {
        return this.selectedOrders.find(o => o.id === order.id) != null;
    }

    /**
     * Called when the selection of all rows is toggled.
     */
    protected onToggleAll(selected: boolean): void
    {
        if (selected)
        {
            this.selectedOrders = [...new Set(this.selectedOrders.concat(this.orders))];
        }
        else
        {
            this.selectedOrders = this.selectedOrders.filter(so => !this.orders.find(o => o.id === so.id));
        }
    }

    /**
     * Called when a "Create route" is clicked.
     * Opens a modal showing the details of creating the route.
     * @param orders The orders to makes the route from.
     */
    protected async onCreateRouteClick(orders: OrderInfo[]): Promise<void>
    {
        const createdRoute = await this._modalService.open(CreateRoutePanel, { orders: orders }).promise;
        console.log(createdRoute)

        if (createdRoute != null)
        {
            createdToast.body = createdToast.body.replace("{routeSlug}", createdRoute.slug);

            this._toastService.open(
                "info",
                createdToast
            );

            this.selectedOrders = [];
            this.update();
        }
    }

    /**
     * Called when the from date changes.
     * Ensures the to date remains valid.
     */
    protected onFromDateChanged(): void
    {
        if (this.fromDateFilter && this.toDateFilter && this.toDateFilter.valueOf() < this.fromDateFilter.valueOf())
        {
            this.toDateFilter = this.fromDateFilter;
        }
    }

    /**
     * Called when the from date changes.
     * Ensures the to date remains valid.
     */
    protected onToDateChanged(): void
    {
        if (this.fromDateFilter && this.toDateFilter && this.toDateFilter.valueOf() < this.fromDateFilter.valueOf())
        {
            this.fromDateFilter = this.toDateFilter;
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
            try {
                this.failed = false;

                // Fetch the data.
                const result = await this._orderService.getAll(
                    this.fromDateFilter,
                    this.toDateFilter ? this.toDateFilter.endOf("day") : undefined,
                    this.statusFilter,
                    this.consignorFilter.length > 0 ? this.consignorFilter.map(c => c.id) : undefined,
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

                // tslint:disable-next-line: no-floating-promises
                this._historyHelper.navigate((state: IHistoryState) =>
                {
                    state.params.page = this.paging.page;
                    state.params.pageSize = this.paging.pageSize;
                    state.params.sortProperty = this.sorting ? this.sorting.property : undefined;
                    state.params.sortDirection = this.sorting ? this.sorting.direction : undefined;
                    state.params.statusFilter = this.statusFilter;
                    state.params.textFilter = this.textFilter || undefined;
                },
                { trigger: false, replace: true });

            } catch (error) {
                this.failed = true;
                Log.error("An error occurred while loading the list.\n", error);
            }
        });
    }
}
