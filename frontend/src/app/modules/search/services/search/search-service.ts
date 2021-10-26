import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { EntityInfo } from "app/types/entity";

/**
 * Represents a service for searching across all entities.
 */
@autoinject
export class SearchService
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
     * Gets all search results matching the query.
     * @param query The search query for which results should be returned.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the entities matching the query.
     */
    public async search(query: string, signal?: AbortSignal): Promise<EntityInfo[]>
    {
        const result = await this._apiClient.get("searches/query",
        {
            query: { text: query },
            signal
        });

        return result.data.map((data: any) => new EntityInfo(data));
    }
}
