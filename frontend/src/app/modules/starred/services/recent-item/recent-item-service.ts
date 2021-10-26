import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { EntityInfo } from "app/types/entity";

/**
 * Represents a service for managing recent items.
 */
@autoinject
export class RecentItemService
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
     * Gets all items recently touched by the user.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the recent items.
     */
    public async getAll(signal?: AbortSignal): Promise<EntityInfo[]>
    {
        const result = await this._apiClient.get("recent",
        {
            signal
        });

        return result.data.map((data: any) => new EntityInfo(data));
    }

    /**
     * Adds the entity identified by the specified id as a recent item.
     * @param identifier The identifier for the entity to add.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    public async add(identifier: string): Promise<void>
    {
        await this._apiClient.put(`recent/${identifier}`);
    }
}
