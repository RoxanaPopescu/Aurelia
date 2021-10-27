import { autoinject } from "aurelia-framework";
import { DateTime } from "luxon";
import { Id } from "shared/utilities";
import { ApiClient } from "shared/infrastructure";
import { LocalStateService } from "app/services/local-state";
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
     * @param localStateService The `LocalStateService` instance.
     */
    public constructor(apiClient: ApiClient, localStateService: LocalStateService)
    {
        this._apiClient = apiClient;
        this._localStateService = localStateService;
    }

    private readonly _apiClient: ApiClient;
    private readonly _localStateService: LocalStateService;

    /**
     * Gets all recent searches.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the recent searches.
     */
    public async getAll(signal?: AbortSignal): Promise<SearchInfo[]>
    {
        if (false)
        {
            const result = await this._apiClient.get("searches/recent",
            {
                signal
            });

            return result.data.map((data: any) => new SearchInfo(data));
        }

        return this._localStateService.get().recentSearches?.map((data: any) => new SearchInfo(data)) ?? [];
    }

    /**
     * Adds the specified query as a recent search.
     * @param query The search query to add as a recent search.
     * @returns A promise that will be resolved with the recent search.
     */
    public async add(query: string): Promise<SearchInfo>
    {
        if (false)
        {
            const result = await this._apiClient.post("searches/recent",
            {
                body: { text: query }
            });

            return new SearchInfo(result.data);
        }

        const searchInfo = new SearchInfo(
        {
            id: Id.uuid(1),
            text: query,
            createdDateTime: DateTime.local()
        });

        this._localStateService.mutate(state =>
        {
            if (state.recentSearches == null)
            {
                state.recentSearches = [];
            }

            const index = state.recentSearches.findIndex(i => i.text === query);

            if (index > -1)
            {
                state.recentSearches.splice(index, 1);
            }

            // Add the item to the top of the recent collection.
            state.recentSearches.unshift(searchInfo);
        });

        return searchInfo;
    }
}
