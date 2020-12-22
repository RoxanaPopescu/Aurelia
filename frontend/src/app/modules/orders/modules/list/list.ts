import { autoinject, observable, computedFrom } from "aurelia-framework";
import { DateTime } from "luxon";
import { ISorting, IPaging, SortingDirection } from "shared/types";
import { Operation } from "shared/utilities";
import { HistoryHelper, IHistoryState, Log } from "shared/infrastructure";
import { IScroll, ModalService, ToastService } from "shared/framework";
import { AgreementService } from "app/model/agreement";
import { OrderService, OrderInfo, OrderStatusSlug, OrderListColumn } from "app/model/order";
import { Consignor } from "app/model/outfit";
import { CreateRoutePanel } from "./modals/create-route/create-route";
import createdRouteToast from "./resources/strings/created-route-toast.json";
import createdCollectionPointToast from "./resources/strings/created-collection-point-toast.json";
import { OrderSelectColumnsPanel } from "./modals/select-columns/select-columns";

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
    consignorFilter?: string;
    orderTagsFilter?: string;
    fromDateFilter?: string;
    toDateFilter?: string;
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

        const localData = localStorage.getItem("order-columns");

        if (localData != null)
        {
            const columnsObject = JSON.parse(localData);
            this.customColumns = columnsObject.map(slug => new OrderListColumn(slug));
        }
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
     * The custom grid column widths calculated from the columns
     */
    @computedFrom("columns")
    protected get tableStyle(): any
    {
        let size = "";

        for (const column of this.columns)
        {
            if (column.column !== "not-added")
            {
                size += `${column.columSize} `;
            }
        }

        return { "grid-template-columns": `60rem ${size} min-content` };
    }

    /**
     * The custom columns the user has selected
     */
    protected customColumns: OrderListColumn[] | undefined;

    /**
     * The current columns to show in the list
     */
    @computedFrom("customColumns")
    protected get columns(): OrderListColumn[]
    {
        return this.customColumns ?? [
            new OrderListColumn("slug"),
            new OrderListColumn("tags"),
            new OrderListColumn("pickup-date"),
            new OrderListColumn("pickup-time"),
            new OrderListColumn("pickup-address"),
            new OrderListColumn("delivery-address"),
            new OrderListColumn("status")
        ];
    }

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
     * The order tags for which orders should be shown.
     */
    @observable({ changeHandler: "update" })
    protected orderTagsFilter: any[] = [];

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
    protected results: OrderInfo[] | undefined;

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
     */
    public async activate(params: IRouteParams): Promise<void>
    {
        this.paging.page = params.page || this.paging.page;
        this.paging.pageSize = params.pageSize || this.paging.pageSize;
        this.sorting.property = params.sortProperty || this.sorting.property;
        this.sorting.direction = params.sortDirection || this.sorting.direction;
        this.statusFilter = params.statusFilter ? params.statusFilter.split(",") as any : this.statusFilter;
        this.textFilter = params.textFilter || this.textFilter;
        this.orderTagsFilter = params.orderTagsFilter?.split(",") || this.orderTagsFilter;
        this.fromDateFilter = params.fromDateFilter ? DateTime.fromISO(params.fromDateFilter, { setZone: true }) : undefined;
        this.toDateFilter = params.toDateFilter ? DateTime.fromISO(params.toDateFilter, { setZone: true }) : undefined;

        if (params.consignorFilter)
        {
            const agreements = await this._agreementService.getAll();
            this.consignors = agreements.agreements.filter(c => c.type.slug === "consignor");

            this.consignorFilter = params.consignorFilter?.split(",")
                .map(id => this.consignors.find(o => o.id === id)) || this.consignorFilter;
        }
        else
        {
            // Execute tasks that should not block rendering.

            // tslint:disable-next-line: no-floating-promises
            (async () =>
            {
                const agreements = await this._agreementService.getAll();
                this.consignors = agreements.agreements.filter(c => c.type.slug === "consignor");

            })();
        }

        this.update();
    }

    /**
     * Called by the framework when the module is deactivated.
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
        if (this.results == null)
        {
            return;
        }

        if (selected)
        {
            this.selectedOrders = [...new Set(this.selectedOrders.concat(this.results))];
        }
        else
        {
            this.selectedOrders = this.selectedOrders.filter(so => !this.results!.find(o => o.id === so.id));
        }
    }

    /**
     * Called when a "Create route" is clicked.
     * Opens a modal showing the details of creating the route.
     * @param orders The orders to makes the route from.
     */
    protected async onCreateRouteClick(orders: OrderInfo[]): Promise<void>
    {
        const result = await this._modalService.open(CreateRoutePanel, { orders: orders }).promise;

        if (result != null)
        {
            if (result.collectionPointIds != null)
            {
                createdCollectionPointToast.body = createdCollectionPointToast.body.replace("{routeSlug}", result.slug);
                createdCollectionPointToast.body = createdCollectionPointToast.body.replace("{collectionPointCount}", String(result.collectionPointIds.length));
                createdCollectionPointToast.url = createdCollectionPointToast.url.replace("{routeSlug}", result.slug);

                this._toastService.open("info", createdCollectionPointToast);
            }
            else
            {
                createdRouteToast.body = createdRouteToast.body.replace("{routeSlug}", result.slug);
                createdRouteToast.url = createdRouteToast.url.replace("{routeSlug}", result.slug);

                this._toastService.open("info", createdRouteToast);
            }

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
     * Called when the `Select columns` button is clicked.
     * Opens the panel for selecting the columns to see.
     */
    protected async onSelectColumnsClick(): Promise<void>
    {
        const columns = await this._modalService.open(
            OrderSelectColumnsPanel,
            this.columns
        ).promise;

        if (columns != null)
        {
            this.customColumns = columns;
            this.results = undefined;
            this.update();
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
            try
            {
                this.failed = false;

                // Fetch the data.
                const result = await this._orderService.getAll(
                    this.fromDateFilter,
                    this.toDateFilter ? this.toDateFilter.endOf("day") : undefined,
                    this.statusFilter,
                    this.consignorFilter.length > 0 ? this.consignorFilter.map(c => c.id) : undefined,
                    this.orderTagsFilter,
                    this.textFilter,
                    this.sorting,
                    this.paging,
                    signal);

                // Update the state.
                this.results = result.orders;
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
                    state.params.sortProperty = this.sorting?.property;
                    state.params.sortDirection = this.sorting?.direction;
                    state.params.statusFilter = this.statusFilter?.join(",") || undefined;
                    state.params.textFilter = this.textFilter || undefined;
                    state.params.consignorFilter = this.consignorFilter?.map(o => o.id).join(",") || undefined;
                    state.params.orderTagsFilter = this.orderTagsFilter?.join(",") || undefined;
                    state.params.fromDateFilter = this.fromDateFilter?.toISO();
                    state.params.toDateFilter = this.toDateFilter?.toISO();
                },
                { trigger: false, replace: true });

            }
            catch (error)
            {
                this.failed = true;
                Log.error("An error occurred while loading the list.\n", error);
            }
        });
    }
}
