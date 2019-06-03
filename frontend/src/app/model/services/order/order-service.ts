import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { IPaging, ISorting } from "shared/types";
import { OrderInfo } from "../../entities/order/list";
import { OrderStatusSlug, Order } from "../../entities/order";
import { getLegacyOrderSortProperty, getLegacySortDirection, getLegacyOrderStatus } from "legacy/helpers/api-helper";

/**
 * Represents a service that manages orders.
 */
@autoinject
export class OrderService
{
    /**
     * Creates a new instance of the type.
     * @param apiClient The `ApiClient` instance.
     */
    public constructor(apiClient: ApiClient)
    {
        this._apiClient = apiClient;
    }

    private readonly _apiClient: ApiClient;

    /**
     * Gets all orders associatd with the current user.
     * @param statusFilter The order status to filter by, or undefined to apply no status filter.
     * @param textFilter The order text to filter by, or undefined to apply no text filter.
     * @param sorting The sorting options to use.
     * @param paging The paging options to use.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the orders.
     */
    public async getAll(statusFilter?: OrderStatusSlug, textFilter?: string, sorting?: ISorting, paging?: IPaging, signal?: AbortSignal): Promise<{ orders: OrderInfo[]; orderCount: number }>
    {
        const result = await this._apiClient.post("orderlist",
        {
            body:
            {
                page: paging ? paging.page : undefined,
                pageSize: paging ? paging.pageSize : undefined,
                sorting: sorting ? [{ field: getLegacyOrderSortProperty(sorting.property), direction: getLegacySortDirection(sorting.direction) }] : [],
                status: statusFilter ? [getLegacyOrderStatus(statusFilter)] : undefined,
                filter: textFilter ? [textFilter] : undefined
            },
            signal
        });

        return {
            orders: result.data.orders.map((data: any) => new OrderInfo(data)),
            orderCount: result.data.totalCount
        };
    }

    /**
     * Gets the specified order.
     * @param orderSlug The slug identifying the order.
     * @returns A promise that will be resolved with the order.
     */
    public async get(orderSlug: string): Promise<Order>
    {
        const result = await this._apiClient.get("orderdetails",
        {
            query: { id: orderSlug }
        });

        return new Order(result.data);
    }
}
