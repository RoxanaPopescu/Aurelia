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
     * Gets the tags using which order groups may be filtered.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the available tags.
     */
    public async getAllTags(signal?: AbortSignal): Promise<string[]>
    {
        const result = await this._apiClient.post("ordergroups/tags",
        {
            signal
        });

        return result.data;
    }

    /**
     * Gets all order groups visible to the current user.
     * @param filter The filter options to use.
     * @param sorting The sorting options to use.
     * @param paging The paging options to use.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the order groups.
     */
    public async getAll(filter?: IOrderGroupFilter, sorting?: ISorting, paging?: IPaging, signal?: AbortSignal): Promise<{ orderGroups: OrderGroup[]; orderGroupCount: number }>
    {
        const result = await this._apiClient.post("ordergroups/list",
        {
            body:
            {
                filter,
                paging,
                sorting
            },
            signal
        });

        return {
            orderGroups: result.data.orderGroups.map((data: any) => new OrderGroup(data)),
            orderGroupCount: result.data.orderGroupCount
        };
    }

    /**
     * Gets the order group with the specified ID.
     * @param id The ID of the order group to get.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the order group.
     */
    public async get(id: string, signal?: AbortSignal): Promise<OrderGroup>
    {
        const result = await this._apiClient.post("ordergroups/details",
        {
            body: { id },
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
     * Pauses the specified order group.
     * @param id The ID of the order group to pause.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async pause(id: string): Promise<void>
    {
        await this._apiClient.post("ordergroups/pause",
        {
            body: { id }
        });
    }

    /**
     * Pauses the specified order group.
     * @param id The ID of the order group to pause.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async unpause(id: string): Promise<void>
    {
        await this._apiClient.post("ordergroups/unpause",
        {
            body: { id }
        });
    }
}
