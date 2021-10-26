import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { SearchInfo } from "../search";

/**
 * Represents a service for managing saved searches.
 */
@autoinject
export class SavedSearchService
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
     * Gets all saved searches.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the saved searches.
     */
    public async getAll(signal?: AbortSignal): Promise<SearchInfo[]>
    {
        const result = await this._apiClient.get("searches/saved",
        {
            signal
        });

        return result.data.map((data: any) => new SearchInfo(data));
    }

    /**
     * Adds the specified query as a saved search.
     * @param query The search query to add as a saved search.
     * @returns A promise that will be resolved with the saved search.
     */
    public async add(query: string): Promise<SearchInfo>
    {
        const result = await this._apiClient.post("searches/saved",
        {
            body: { text: query }
        });

        return new SearchInfo(result.data);
    }

    /**
     * Deletes the specified saved search.
     * @param id The ID of the saved search to delete.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    public async delete(id: string): Promise<void>
    {
        await this._apiClient.delete(`searches/saved/${id}`);
    }
}
