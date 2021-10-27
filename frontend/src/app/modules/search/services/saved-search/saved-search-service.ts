import { autoinject } from "aurelia-framework";
import { DateTime } from "luxon";
import { Id } from "shared/utilities";
import { ApiClient } from "shared/infrastructure";
import { SearchInfo } from "../search";
import { LocalStateService } from "app/services/local-state";

/**
 * Represents a service for managing saved searches.
 */
@autoinject
export class SavedSearchService
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
     * Gets all saved searches.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the saved searches.
     */
    public async getAll(signal?: AbortSignal): Promise<SearchInfo[]>
    {
        if (false)
        {
            const result = await this._apiClient.get("searches/saved",
            {
                signal
            });

            return result.data.map((data: any) => new SearchInfo(data));
        }

        return this._localStateService.get().savedSearches?.map((data: any) => new SearchInfo(data)) ?? [];
    }

    /**
     * Adds the specified query as a saved search.
     * @param query The search query to add as a saved search.
     * @returns A promise that will be resolved with the saved search.
     */
    public async add(query: string): Promise<SearchInfo>
    {
        if (false)
        {
            const result = await this._apiClient.post("searches/saved",
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
            if (state.savedSearches == null)
            {
                state.savedSearches = [];
            }

            const index = state.savedSearches.findIndex(i => i.text === query);

            if (index > -1)
            {
                state.savedSearches.splice(index, 1);
            }

            // Add the item to the top of the saved collection.
            state.savedSearches.unshift(searchInfo);
        });

        return searchInfo;
    }

    /**
     * Deletes the specified saved search.
     * @param id The ID of the saved search to delete.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    public async delete(id: string): Promise<void>
    {
        if (false)
        {
            await this._apiClient.delete(`searches/saved/${id}`);
        }

        this._localStateService.mutate(state =>
        {
            const index = state.savedSearches?.findIndex(s => s.id === id);

            if (index > -1)
            {
                state.savedSearches.splice(index, 1);
            }
        });
    }
}
