import { autoinject } from "aurelia-framework";
import { DateTime } from "luxon";
import { IPaging, ISorting } from "shared/types";
import { ApiClient } from "shared/infrastructure";
import { OrderStatusSlug } from "../entities/order-status";
import { OrderInfo } from "../entities/order-info";
import { getLegacyOrderSortProperty, getLegacySortDirection, getLegacyOrderStatus } from "legacy/helpers/api-helper";
import { Order } from "../entities/order";
import { OrderEvent } from "../entities/order-event";

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
     * Gets all orders visible to the current user.
     * @param fromDate The first date for which orders should be returned, or undefined to apply no limit.
     * @param toDate The last date for which orders should be returned, or undefined to apply no limit.
     * @param statusFilter The order statuses to filter by, or undefined to apply no status filter.
     * @param consignorFilter The IDs of the consignors for which orders should be returned, or undefined to disable this filter.
     * @param orderTagsFilter The order tags for which orders should be returned, or undefined to disable this filter.
     * @param textFilter The order text to filter by, or undefined to apply no text filter.
     * @param sorting The sorting options to use.
     * @param paging The paging options to use.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the orders.
     */
    public async getAll(
        fromDate?: DateTime,
        toDate?: DateTime,
        statusFilter?: OrderStatusSlug[],
        consignorFilter?: string[],
        orderTagsFilter?: string[],
        textFilter?: string,
        sorting?: ISorting,
        paging?: IPaging,
        signal?: AbortSignal): Promise<{ orders: OrderInfo[]; orderCount: number }>
    {
        const result = await this._apiClient.post("orderlist",
        {
            body:
            {
                fromDate,
                toDate,
                status: statusFilter ? statusFilter.map(s => getLegacyOrderStatus(s)) : undefined,
                consignorIds: consignorFilter,
                tagsAllRequired: orderTagsFilter,
                filter: textFilter ? [textFilter] : undefined,
                sorting: sorting ? [{ field: getLegacyOrderSortProperty(sorting.property), direction: getLegacySortDirection(sorting.direction) }] : [],
                page: paging ? paging.page : undefined,
                pageSize: paging ? paging.pageSize : undefined
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
        const result = await this._apiClient.get("orders/v2/details",
        {
            query: { slug: orderSlug }
        });

        return new Order(result.data);
    }

    /**
     * Gets the specified order.
     * @param orderSlug The slug identifying the order.
     * @returns A promise that will be resolved with the order.
     */
    public async getRouteId(orderSlug: string): Promise<string | undefined>
    {
        const result = await this._apiClient.get("journeydetails",
        {
            query: { orderId: orderSlug }
        });

        if (result.data.passages.length > 0)
        {
            return result.data.passages[0].slug;
        }

        return undefined;
    }

    /**
     * Gets the relabel url.
     * @param barcode The barcode in our system to relabel.
     * @returns A promise that will be resolved with the url of the relabel.
     */
    public async getRelabelUrl(barcode: string): Promise<string | undefined>
    {
        const result = await this._apiClient.post("orders/relabel",
        {
            body: { barcode: barcode }
        });

        return result.data.urlToLabel;
    }

    /**
     * Gets the specified order.
     * @param orderSlug The slug identifying the order.
     * @returns A promise that will be resolved with the events.
     */
    public async getEvents(orderSlug: string): Promise<{completedEvents: OrderEvent[]; futureEvents: OrderEvent[]}>
    {
        const result = await this._apiClient.get("orders/v2/events",
        {
            query: { slug: orderSlug }
        });

        return {
            completedEvents: result.data.completedEvents.map(ce => new OrderEvent(ce)),
            futureEvents: result.data.futureEvents.map(fe => new OrderEvent(fe))
        };
    }

    /**
     * Saves the specified order.
     * @param order The order.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async saveOrder(order: Order): Promise<void>
    {
        await this._apiClient.post("orders/v2/edit",
        {
            body: { order: order.toJSON() }
        });
    }

    /**
     * Updated the state in the order.
     * @param order The order.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async updateStatus(order: Order, status: OrderStatusSlug): Promise<void>
    {
        await this._apiClient.post("orders/updatestatus",
        {
            body: { id: order.id, slug: order.slug, status: status }
        });
    }
}
