import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { HistoryHelper, Log } from "shared/infrastructure";
import { ModalService, ToastService } from "shared/framework";
import { LocalStateService } from "app/services/local-state";
import { OrderInfo, OrderService } from "app/model/order";
import { ListViewService, ListView, OrderListViewFilter, OrderListViewColumn } from "app/model/list-view";
import { IListViewPageItems, IListViewPageParams, ListViewsPage } from "app/modules/list-views/list-views";
import { ImportOrdersPanel } from "app/modules/orders/modules/list/modals/import-orders/import-orders";
import { BulkActionPanel } from "app/modules/orders/modules/list/modals/bulk-action/bulk-action";
import { CreateRoutePanel } from "app/modules/orders/modules/list/modals/create-route/create-route";
import { ChangePickupAddressPanel } from "app/modules/orders/modules/list/modals/change-pickup-address/change-pickup-address";
import createdRouteToast from "app/modules/orders/modules/list/resources/strings/created-route-toast.json";
import createdCollectionPointToast from "app/modules/orders/modules/list/resources/strings/created-collection-point-toast.json";
import changedPickupAddressToast from "app/modules/orders/modules/list/resources/strings/changed-pickup-address-toast.json";

/**
 * Represents the order parameters for the page.
 */
// tslint:disable-next-line: no-empty-interface
export interface IOrderListViewPageParams extends IListViewPageParams
{
}

/**
 * Represents the page.
 */
@autoinject
export class OrderListViewsPage extends ListViewsPage<OrderListViewFilter, OrderInfo>
{
    /**
     * Creates a new instance of the type.
     * @param router The `Router` instance.
     * @param historyHelper The `HistoryHelper` instance.
     * @param modalService The `ModalService` instance.
     * @param localStateService The `LocalStateService` instance.
     * @param listViewService The `ListViewService` instance.
     * @param toastService The `ToastService` instance.
     * @param orderService The `OrderService` instance.
     */
    public constructor(
        router: Router,
        historyHelper: HistoryHelper,
        modalService: ModalService,
        localStateService: LocalStateService,
        toastService: ToastService,
        listViewService: ListViewService,

        orderService: OrderService)
    {
        super(router, historyHelper, modalService, localStateService, listViewService);

        this._toastService = toastService;
        this._orderService = orderService;
    }

    private readonly _toastService: ToastService;
    private readonly _orderService: OrderService;

    /**
     * The type of list views presented by the page.
     */
    protected readonly listViewType = "order";

    /**
     * The type of list views presented by the page.
     */
    protected readonly listViewColumnType = OrderListViewColumn;

    /**
     * Called by the framework when the module is activated.
     * @param params The order parameters from the URL.
     * @returns A promise that will be resolved when the operation completes.
     */
    public async activate(params: IOrderListViewPageParams): Promise<void>
    {
        await super.activate(params);
    }

    /**
     * Called by the framework when the module is deactivated.
     * @returns A promise that will be resolved when the operation completes.
     */
    public async deactivate(): Promise<void>
    {
        await super.deactivate();
    }

    /**
     * Fetches the the items to present.
     * @param listView The list view for which to fetch.
     * @param signal The abort signal for the operation.
     * @returns A promise that will be resolved with a model representing the items to present.
     */
    protected async fetch(listView: ListView<OrderListViewFilter, OrderInfo>, signal: AbortSignal): Promise<IListViewPageItems>
    {
        return this.fetchOrders(listView, signal);
    }

    /**
     * Checks if the specified order is selected.
     * @param order The order to check.
     * @returns a boolean to determine the result.
     */
    protected isItemSelected(order: OrderInfo): boolean
    {
        const listView = this.activeListView!;

        return listView.selectedItems.some(i => i.id === order.id);
    }

    /**
     * Called when the selection of a row is toggled.
     */
    protected onToggleItem(order: OrderInfo, selected: boolean): void
    {
        const listView = this.activeListView!;

        if (selected)
        {
            listView.selectedItems.push(order);
        }
        else
        {
            listView.selectedItems.splice(listView.selectedItems.findIndex(i => i.id === order.id), 1);
        }

        listView.selectedItems = listView.selectedItems.slice();
    }

    /**
     * Called when the selection of all rows is toggled.
     */
    protected onToggleAllItems(selected: boolean): void
    {
        const listView = this.activeListView!;

        if (listView.items == null)
        {
            return;
        }

        if (selected)
        {
            listView.selectedItems = [...new Set(listView.selectedItems.concat(listView.items))];
        }
        else
        {
            listView.selectedItems = listView.selectedItems.filter(si => !listView.items!.find(i => i.id === si.id));
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
     * Called when any bulk action is clicked.
     * Opens the bulk action panel.
     * @param orders The selected orders.
     */
     protected async onBulkActionClick(orders: OrderInfo[]): Promise<void>
     {
         await this._modalService.open(BulkActionPanel, { orders: orders }).promise;

         // TODO TOAST
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
            const listView = this.activeListView!;

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

            listView.selectedItems = [];

            this.update(listView);
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
            const listView = this.activeListView!;

            const toastModel =
            {
                heading: changedPickupAddressToast.heading,
                body: changedPickupAddressToast.body
                    .replace("{orderCount}", orders.length.toString())
            };

            this._toastService.open("success", toastModel);

            listView.selectedItems = [];

            this.update(listView);
        }
    }

    /**
     * Fetches the the items to present.
     * @param listView The list view for which to fetch.
     * @param signal The abort signal for the operation.
     * @returns A promise that will be resolved with a model representing the items to present.
     */
    private async fetchOrders(listView: ListView<OrderListViewFilter, OrderInfo>, signal: AbortSignal): Promise<IListViewPageItems>
    {
        const filter = listView.definition.filter;

        try
        {
            const result = await this._orderService.getAll(
                filter.fromDateFilter,
                filter.useRelativeToDateFilter ? filter.toDateFilter : filter.toDateFilter?.endOf("day"),
                filter.statusFilter,
                filter.consignorFilter.length > 0 ? filter.consignorFilter.map(c => c.id) : undefined,
                filter.orderTagsFilter,
                filter.textFilter,
                listView.definition.sorting,
                listView.paging,
                signal);

            for (let i = 0; i < listView.selectedItems.length; i++)
            {
                const order = result.orders.find(o => o.id === listView.selectedItems[i].id);

                if (order != null)
                {
                    listView.selectedItems.splice(i, 1, order);
                }
            }

            return { items: result.orders, itemCount: result.orderCount };
        }
        catch (error)
        {
            Log.error("An error occurred while fetching the items.", error);

            throw error;
        }
    }
}
