import { autoinject, observable, computedFrom } from "aurelia-framework";
import { DateTime, Duration } from "luxon";
import { ISorting, IPaging, SortingDirection } from "shared/types";
import { Operation } from "shared/utilities";
import { HistoryHelper, IHistoryState, Log } from "shared/infrastructure";
import { IScroll, ModalService, ToastService } from "shared/framework";
import { OrderService, OrderInfo, OrderStatusSlug, OrderListColumn } from "app/model/order";
import { Consignor } from "app/model/outfit";
import { SelectColumnsPanel } from "app/modals/panels/select-columns/select-columns";
import { CreateRoutePanel } from "./modals/create-route/create-route";
import { ChangePickupAddressPanel } from "./modals/change-pickup-address/change-pickup-address";
import createdRouteToast from "./resources/strings/created-route-toast.json";
import createdCollectionPointToast from "./resources/strings/created-collection-point-toast.json";
import changedPickupAddressToast from "./resources/strings/changed-pickup-address-toast.json";
import { ImportOrdersPanel } from "./modals/import-orders/import-orders";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    page?: string;
    pageSize?: string;
    sortProperty?: string;
    sortDirection?: SortingDirection;
    textFilter?: string;
    statusFilter?: string;
    consignorFilter?: string;
    orderTagsFilter?: string;
    fromDateFilter?: string;
    toDateFilter?: string;
    relativeFromDateFilter?: string;
    relativeToDateFilter?: string;
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
     */
    public constructor(
        orderService: OrderService,
        historyHelper: HistoryHelper,
        modalService: ModalService,
        toastService: ToastService)
    {
        this._orderService = orderService;
        this._historyHelper = historyHelper;
        this._modalService = modalService;
        this._toastService = toastService;
        this._constructed = true;

        const storedColumnsJson = localStorage.getItem("order-columns");

        if (storedColumnsJson != null)
        {
            this.customColumns = JSON.parse(storedColumnsJson)
                .filter(slug => Object.keys(OrderListColumn.values).includes(slug))
                .map(slug => new OrderListColumn(slug));
        }
    }

    private readonly _orderService: OrderService;
    private readonly _historyHelper: HistoryHelper;
    private readonly _modalService: ModalService;
    private readonly _toastService: ToastService;
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
        return { "grid-template-columns": `60rem ${this.columns.map(c => c.width).join(" ")} min-content` };
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
     * The min date for which orders should be shown.
     */
    @observable({ changeHandler: "update" })
    protected fromDateFilter: DateTime | undefined;

    /**
     * The max date for which orders should be shown.
     */
    @observable({ changeHandler: "update" })
    protected toDateFilter: DateTime | undefined;

    /**
     * True to use `relativeFromDateFilter`, otherwise false.
     */
     @observable({ changeHandler: "updateRelative" })
    protected useRelativeFromDateFilter = false;

    /**
     * The min relative time for which orders should be shown.
     */
    @observable({ changeHandler: "updateRelative" })
    protected relativeFromDateFilter: Duration | undefined;

    /**
     * The unit in which `relativeFromDateFilter` is specified.
     */
     @observable({ changeHandler: "updateRelative" })
    protected relativeFromDateFilterUnit: "days" | "hours" | undefined;

    /**
     * True to use `relativeToDateFilter`, otherwise false.
     */
     @observable({ changeHandler: "updateRelative" })
    protected useRelativeToDateFilter = false;

    /**
     * The max relative time for which orders should be shown.
     */
    @observable({ changeHandler: "updateRelative" })
    protected relativeToDateFilter: Duration | undefined;

    /**
     * The unit in which `relativeToDateFilter` is specified.
     */
     @observable({ changeHandler: "updateRelative" })
    protected relativeToDateFilterUnit: "days" | "hours" | undefined;

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
    public activate(params: IRouteParams): void
    {
        this.paging.page = params.page != null ? parseInt(params.page) : this.paging.page;
        this.paging.pageSize = params.pageSize != null ? parseInt(params.pageSize) : this.paging.pageSize;
        this.sorting.property = params.sortProperty || this.sorting.property;
        this.sorting.direction = params.sortDirection || this.sorting.direction;
        this.textFilter = params.textFilter || this.textFilter;
        this.statusFilter = params.statusFilter ? params.statusFilter.split(",") as any : this.statusFilter;
        this.orderTagsFilter = params.orderTagsFilter?.split(",") || this.orderTagsFilter;
        this.fromDateFilter = params.fromDateFilter ? DateTime.fromISO(params.fromDateFilter, { setZone: true }) : undefined;
        this.toDateFilter = params.toDateFilter ? DateTime.fromISO(params.toDateFilter, { setZone: true }) : undefined;

        this.relativeFromDateFilterUnit =
            params.relativeFromDateFilter?.includes("D") ? "days" :
            params.relativeFromDateFilter?.includes("H") ? "hours" :
            "hours";
        this.useRelativeFromDateFilter = params.relativeFromDateFilter != null;
        this.relativeFromDateFilter = params.relativeFromDateFilter ? Duration.fromISO(params.relativeFromDateFilter) : undefined;

        this.relativeToDateFilterUnit =
            params.relativeToDateFilter?.includes("D") ? "days" :
            params.relativeToDateFilter?.includes("H") ? "hours" :
            "hours";
        this.useRelativeToDateFilter = params.relativeToDateFilter != null;
        this.relativeToDateFilter = params.relativeToDateFilter ? Duration.fromISO(params.relativeToDateFilter) : undefined;

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
     * Called when the `Select columns` button is clicked.
     * Opens the panel for selecting the columns to see.
     */
    protected async onSelectColumnsClick(): Promise<void>
    {
        const model =
        {
            availableColumns: Object.keys(OrderListColumn.values).map(slug => new OrderListColumn(slug as any)),
            selectedColumns: this.columns
        };

        const selectedColumns = await this._modalService.open(SelectColumnsPanel, model).promise;

        if (selectedColumns != null)
        {
            localStorage.setItem("order-columns", JSON.stringify(selectedColumns));

            this.customColumns = selectedColumns as OrderListColumn[];
            this.results = undefined;
            this.update();
        }
    }

    /**
     * Called when the `Import orders` button is clicked.
     * Opens the import orders panel.
     */
    protected async onImportOrdersClick(): Promise<void>
    {
        await this._modalService.open(ImportOrdersPanel).promise;
    }

    /**
     * Called when the `Create route from selected orders` button is clicked.
     * Opens the create route panel.
     * @param orders The selected orders.
     */
    protected async onCreateRouteClick(orders: OrderInfo[]): Promise<void>
    {
        const result = await this._modalService.open(CreateRoutePanel, { orders: orders }).promise;

        if (result != null)
        {
            if (result.collectionPointIds != null)
            {
                const toastModel =
                {
                    heading: createdCollectionPointToast.heading,
                    body: createdCollectionPointToast.body
                        .replace("{routeSlug}", result.slug)
                        .replace("{collectionPointCount}", String(result.collectionPointIds.length)),
                    url: createdCollectionPointToast.url.replace("{routeSlug}", result.slug)
                };

                this._toastService.open("success", toastModel);
            }
            else
            {
                const toastModel =
                {
                    heading: createdRouteToast.heading,
                    body: createdRouteToast.body.replace("{routeSlug}", result.slug),
                    url: createdRouteToast.url.replace("{routeSlug}", result.slug)
                };

                this._toastService.open("success", toastModel);
            }

            this.selectedOrders = [];
            this.update();
        }
    }

    /**
     * Called when the `Change pickup address of selected orders` button is clicked.
     * Opens the change pickup address panel.
     * @param orders The selected orders.
     */
    protected async onChangePickupAddressClick(orders: OrderInfo[]): Promise<void>
    {
        const result = await this._modalService.open(ChangePickupAddressPanel, { orders: orders }).promise;

        if (result)
        {
            const toastModel =
            {
                heading: changedPickupAddressToast.heading,
                body: changedPickupAddressToast.body
                    .replace("{orderCount}", orders.length.toString())
            };

            this._toastService.open("success", toastModel);

            this.selectedOrders = [];
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

                // tslint:disable-next-line: no-floating-promises
                this._historyHelper.navigate((state: IHistoryState) =>
                {
                    state.params.page = propertyName !== "paging" ? 1 : this.paging.page;
                    state.params.pageSize = this.paging.pageSize;
                    state.params.sortProperty = this.sorting?.property;
                    state.params.sortDirection = this.sorting?.direction;
                    state.params.textFilter = this.textFilter || undefined;
                    state.params.statusFilter = this.statusFilter?.join(",") || undefined;
                    state.params.consignorFilter = this.consignorFilter?.map(o => o.id).join(",") || undefined;
                    state.params.orderTagsFilter = this.orderTagsFilter?.join(",") || undefined;
                    state.params.fromDateFilter = this.relativeFromDateFilter != null ? undefined : this.fromDateFilter?.toISO();
                    state.params.toDateFilter = this.relativeToDateFilter != null ? undefined : this.toDateFilter?.toISO();
                    state.params.relativeFromDateFilter = this.relativeFromDateFilter?.shiftTo(this.relativeFromDateFilterUnit!).toISO();
                    state.params.relativeToDateFilter = this.relativeToDateFilter?.shiftTo(this.relativeToDateFilterUnit!).toISO();
                },
                { trigger: false, replace: true });

                // Fetch the data.
                const result = await this._orderService.getAll(
                    this.fromDateFilter,
                    this.useRelativeToDateFilter ? this.toDateFilter : this.toDateFilter?.endOf("day"),
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
                this.scroll?.reset();
            }
            catch (error)
            {
                this.failed = true;
                Log.error("An error occurred while loading the list.", error);
            }
        });
    }

    protected updateRelative(newValue: any, oldValue: any, propertyName: string): void
    {
        const now = DateTime.local();

        if (this.useRelativeFromDateFilter && propertyName !== "relativeFromDateFilterUnit")
        {
            const nowOrStartOfToday = this.relativeFromDateFilterUnit === "days" ? now.startOf("day") : now;

            this.fromDateFilter = this.relativeFromDateFilter != null ? nowOrStartOfToday.plus(this.relativeFromDateFilter) : undefined;
        }
        else if (this.relativeFromDateFilter != null)
        {
            this.relativeFromDateFilter = undefined;
            this.fromDateFilter = undefined;
        }

        if (this.useRelativeToDateFilter && propertyName !== "relativeToDateFilterUnit")
        {
            const nowOrEndOfToday = this.relativeToDateFilterUnit === "days" ? now.endOf("day") : now;

            this.toDateFilter = this.relativeToDateFilter != null ? nowOrEndOfToday.plus(this.relativeToDateFilter) : undefined;
        }
        else if (this.relativeToDateFilter != null)
        {
            this.relativeToDateFilter = undefined;
            this.toDateFilter = undefined;
        }
    }

    /**
     * Gets the current view state, which may be saved as a view preset.
     * @returns The current view state.
     */
    protected getViewState(): any
    {
        return {
            sorting: this.sorting,
            columns: this.columns.map(column => column.slug),
            pageSize: this.paging.pageSize,
            filters:
            {
                textFilter: this.textFilter,
                statusFilter: this.statusFilter,
                consignorFilter: this.consignorFilter,
                orderTagsFilter: this.orderTagsFilter,
                fromDateFilter: this.useRelativeFromDateFilter ? undefined : this.fromDateFilter?.toISO(),
                toDateFilter: this.useRelativeToDateFilter ? undefined : this.toDateFilter?.toISO(),
                relativeFromDateFilter: this.relativeFromDateFilter?.toISO(),
                relativeToDateFilter: this.relativeToDateFilter?.toISO()
            }
        };
    }

    /**
     * Sets the current view state, to match the specified state.
     * @param state The view state to apply.
     */
    protected setViewState(state: any): void
    {
        this.sorting = state.sorting;
        this.customColumns = state.columns.map(slug => new OrderListColumn(slug));
        this.paging = { ...this.paging, pageSize: state.pageSize };
        this.textFilter = state.filters.textFilter;
        this.statusFilter = state.filters.statusFilter;
        this.consignorFilter = state.filters.consignorFilter;
        this.orderTagsFilter = state.filters.orderTagsFilter;
        this.fromDateFilter = state.filters.fromDateFilter != null ? DateTime.fromISO(state.filters.fromDateFilter, { setZone: true }) : undefined;
        this.toDateFilter = state.filters.toDateFilter != null ? DateTime.fromISO(state.filters.toDateFilter, { setZone: true }) : undefined;

        this.useRelativeFromDateFilter = state.filters.relativeFromDateFilter != null;
        this.relativeFromDateFilter = state.filters.relativeFromDateFilter ? Duration.fromISO(state.filters.relativeFromDateFilter) : undefined;

        this.useRelativeToDateFilter = state.filters.relativeToDateFilter != null;
        this.relativeToDateFilter = state.filters.relativeToDateFilter ? Duration.fromISO(state.filters.relativeToDateFilter) : undefined;

        this.selectedOrders = [];
        this.results = undefined;
        this.update();
    }
}
