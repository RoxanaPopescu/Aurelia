import { autoinject } from "aurelia-framework";
import { DateTime } from "luxon";
import { IPaging, ISorting } from "shared/types";
import { ApiClient } from "shared/infrastructure";
import { Address } from "app/model/shared";
import { OrderStatusSlug } from "../entities/order-status";
import { OrderInfo } from "../entities/order-info";
import { getLegacyOrderSortProperty, getLegacySortDirection, getLegacyOrderStatus } from "legacy/helpers/api-helper";
import { Order } from "../entities/order";
import { OrderEvent } from "../entities/order-event";
import { OrderImportResult } from "../entities/order-import-result";

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
        const result = await this._apiClient.post("orders/list",
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
     * @param slug The slug identifying the order.
     * @returns A promise that will be resolved with the order.
     */
    public async get(slug: string): Promise<Order>
    {
        const result = await this._apiClient.get(`orders/${slug}`);

        return new Order(result.data);
    }

    /**
     * Gets the ID and slug of the route associated with the specified order, if any.
     * @param orderSlug The slug identifying the order.
     * @returns A promise that will be resolved with the ID of the route associated with the specified order, if any.
     */
    public async getRouteIdAndSlug(orderSlug: string): Promise<{ id: string; slug: string } | undefined>
    {
        const result = await this._apiClient.get(`orders/journey/${orderSlug}`);

        if (result.data.passages.length > 0)
        {
            return { id: result.data.passages[0].routeId, slug: result.data.passages[0].slug };
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
        const result = await this._apiClient.post("orders/re-label",
        {
            body: { barcode: barcode }
        });

        return result.data.urlToLabel;
    }

    /**
     * Gets the events for the specified order.
     * @param consignorId The ID of the consignor owning of the order.
     * @param orderSlug The slug identifying the order.
     * @returns A promise that will be resolved with the events.
     */
    public async getEvents(consignorId: string, orderSlug: string): Promise<OrderEvent[]>
    {
        const result = await this._apiClient.post("orders/events",
        {
            body: { consignorId, orderId: orderSlug }
        });

        const orderEvents = result.data.map(e => new OrderEvent(e)) as OrderEvent[];

        // Ensure the `order-pickup-eta-provided` event, if present, is the first event.

        const pickupEtaProvidedIndex = orderEvents.findIndex(e => e.eventType.slug === "order-pickup-eta-provided");

        if (pickupEtaProvidedIndex > -1)
        {
            orderEvents.unshift(...orderEvents.splice(pickupEtaProvidedIndex, 1));
        }

        // Ensure the `order-delivery-eta-provided` event, if present, is the first event.

        const deliveryEtaProvidedIndex = orderEvents.findIndex(e => e.eventType.slug === "order-delivery-eta-provided");

        if (deliveryEtaProvidedIndex > -1)
        {
            orderEvents.unshift(...orderEvents.splice(deliveryEtaProvidedIndex, 1));
        }

        // Ensure events are sorted by descending date.

        orderEvents.sort((a, b) => b.data.timeOfEvent.valueOf() - a.data.timeOfEvent.valueOf());

        return orderEvents;
    }

    /**
     * Saves the specified order.
     * @param order The order.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async saveOrder(order: Order): Promise<void>
    {
        await this._apiClient.post("orders/edit",
        {
            body: order.toJSON()
        });
    }

    /**
     * Updated the status of the the order.
     * @param order The order.
     * @param status The new order status.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async updateStatus(order: Order, status: OrderStatusSlug): Promise<void>
    {
        await this._apiClient.post("orders/update-status",
        {
            body: { id: order.id, slug: order.slug, status: status }
        });
    }

    /**
     * Removes the specified order from its current route, executing the specified action.
     * @param routeId The ID of the route associated with the order.
     * @param consignorId The ID of the consignor owning of the order.
     * @param orderSlug The slug identifying the order.
     * @param action The action to execute.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async removeFromRoute(routeId: string, consignorId: string, orderSlug: string, action: "release-to-drivers" | "manual-dispatch" | "automatic-dispatch"): Promise<void>
    {
        await this._apiClient.post("orders/remove-from-route",
        {
            body: { routeId, consignorId, orderSlug, action }
        });
    }

    /**
     * @deprecaated Not yet implemented in BFF or backend; see TECH-5714.
     * Changes the pickup address of the specified orders.
     * @param orders The orders for which the pickup address should be changed.
     * @param address The new pickup address.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async changePickupAddress(orderIds: string[], address: Address): Promise<void>
    {
        await this._apiClient.post("orders/change-pickup-address",
        {
            body: { orderIds, address }
        });
    }

    /**
     * Imports the orders represented by the specified file.
     * @param file The file from which to import orders.
     * @returns A promise that will be resolved with the result of the operation.
     */
    public async importFromFile(file: File): Promise<OrderImportResult>
    {
        const formData = new FormData();
        formData.append("file", file);

        const result = await this._apiClient.post("orders/import-from-file",
        {
            body: formData
        });

        return result.data;
    }
}
