import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { IPaging, ISorting } from "shared/types";
import { OrderGroup } from "../entities/order-group";
import { IOrderGroupFilter } from "./order-group-filter";

/**
 * Represents a service that manages order groups used for route planning.
 */
@autoinject
export class OrderGroupService
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
     * Gets all order groups visible to the current user.
     * @param filter The filter options to use.
     * @param sorting The sorting options to use.
     * @param paging The paging options to use.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the order groups.
     */
    public async getAll(filter?: IOrderGroupFilter, sorting?: ISorting, paging?: IPaging, signal?: AbortSignal): Promise<OrderGroup[]>
    {
        const result = await this._apiClient.post("route-planning/order-groups/list",
        {
            body:
            {
                filter,
                paging,
                sorting
            },
            signal
        });

        return result.data.map((data: any) => new OrderGroup(data));
    }

    /**
     * Gets the order group with the specified ID.
     * @param id The ID of the order group to get.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the order group.
     */
    public async get(id: string, signal?: AbortSignal): Promise<OrderGroup>
    {
        const result = await this._apiClient.get(`route-planning/order-groups/${id}`,
        {
            signal
        });

        return new OrderGroup(result.data);
    }

    /**
     * Creates the specified order group.
     * @param orderGroup The data for the order group to create.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the order group.
     */
    public async create(orderGroup: Partial<OrderGroup>, signal?: AbortSignal): Promise<OrderGroup>
    {
        const result = await this._apiClient.post("ordergroups/create",
        {
            body: orderGroup,
            signal
        });

        return new OrderGroup(result.data);
    }

    /**
     * Updates the specified order group.
     * @param orderGroup The order group to update.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the order group.
     */
    public async update(orderGroup: OrderGroup, signal?: AbortSignal): Promise<OrderGroup>
    {
        const result = await this._apiClient.post("ordergroups/update",
        {
            body: orderGroup,
            signal
        });

        return new OrderGroup(result.data);
    }

    /**
     * Deletes the specified order group.
     * @param orderGroup The order group to delete.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async delete(orderGroup: OrderGroup): Promise<void>
    {
        await this._apiClient.post("ordergroups/delete",
        {
            body: { id: orderGroup.id, etag: orderGroup.etag }
        });
    }

    /**
     * Pauses the specified order group.
     * @param orderGroup The order group to pause.
     * @returns A promise that will be resolved updated entity data, such as the new etag.
     */
    public async pause(orderGroup: OrderGroup): Promise<{ etag: string }>
    {
        const result = await this._apiClient.post("ordergroups/pause",
        {
            body: { id: orderGroup.id, etag: orderGroup.etag }
        });

        return result.data;
    }

    /**
     * Pauses the specified order group.
     * @param orderGroup The order group to unpause.
     * @returns A promise that will be resolved updated entity data, such as the new etag.
     */
    public async unpause(orderGroup: OrderGroup): Promise<{ etag: string }>
    {
        const result = await this._apiClient.post("ordergroups/unpause",
        {
            body: { id: orderGroup.id, etag: orderGroup.etag }
        });

        return result.data;
    }
}
