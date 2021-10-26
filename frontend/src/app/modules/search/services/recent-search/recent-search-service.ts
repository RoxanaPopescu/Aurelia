import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { SearchInfo } from "../search";

/**
 * Represents a service for managing recent searches.
 */
@autoinject
export class RecentSearchService
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
     * Gets all recent searches.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the recent searches.
     */
    public async getAll(signal?: AbortSignal): Promise<SearchInfo[]>
    {
        const result = await this._apiClient.get("searches/recent",
        {
            signal
        });

        return result.data.map((data: any) => new SearchInfo(data));
    }

    /**
     * Adds the specified query as a recent search.
     * @param query The search query to add as a recent search.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    public async add(query: string): Promise<void>
    {
        await this._apiClient.post("searches/recent",
        {
            body: { text: query }
        });
    }
}
