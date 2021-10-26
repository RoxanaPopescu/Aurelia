import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { EntityInfo } from "app/types/entity";

/**
 * Represents a service for managing starred items.
 */
@autoinject
export class StarredItemService
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
     * Gets all items starred by the user.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the starred items.
     */
    public async getAll(signal?: AbortSignal): Promise<EntityInfo[]>
    {
        const result = await this._apiClient.get("starred",
        {
            signal
        });

        return result.data.map((data: any) => new EntityInfo(data));
    }

    /**
     * Stars the entity identified by the specified identifier.
     * @param identifier The identifier for the entity to star.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    public async add(identifier: string): Promise<void>
    {
        await this._apiClient.put(`starred/${identifier}`);
    }

    /**
     * Unstars the entity identified by the specified identifier.
     * @param identifier The identifier for the entity to unstar.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    public async remove(identifier: string): Promise<void>
    {
        await this._apiClient.delete(`starred/${identifier}`);
    }
}
