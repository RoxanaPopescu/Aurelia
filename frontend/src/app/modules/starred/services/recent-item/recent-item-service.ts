import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { EntityInfo } from "app/types/entity";
import { LocalStateService } from "app/services/local-state";
import clone from "clone";

/**
 * Represents a service for managing recent items.
 */
@autoinject
export class RecentItemService
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
     * Gets all items recently touched by the user.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the recent items.
     */
    public async getAll(signal?: AbortSignal): Promise<EntityInfo[]>
    {
        if (false)
        {
            const result = await this._apiClient.get("recent",
            {
                signal
            });

            return result.data.map((data: any) => new EntityInfo(data));
        }

        return this._localStateService.get().recentItems?.map((data: any) => new EntityInfo(data)) ?? [];
    }

    /**
     * Adds the entity identified by the specified entity info as a recent item.
     * @param entityInfo The entity info representing the entity to add.
     * @returns A promise that will be resolved with the recent item.
     */
    public async add(entityInfo: EntityInfo): Promise<EntityInfo>
    {
        if (false)
        {
            await this._apiClient.put(`recent/${entityInfo.starId}`);
        }

        // Clone the entity info, and remove any starred state,
        // as we don't want that stored in the recent collection.

        const clonedEntityInfo: EntityInfo | undefined = clone(entityInfo);

        function clearStarredState(e: EntityInfo): void
        {
            e.starred = undefined;

            if (e.parent != null)
            {
                clearStarredState(e.parent);
            }
        }

        clearStarredState(clonedEntityInfo);

        this._localStateService.mutate(state =>
        {
            if (state.recentItems == null)
            {
                state.recentItems = [];
            }

            // Remove the item from the recent collection.

            const index = state.recentItems.findIndex(e => e.starId === clonedEntityInfo.starId);

            if (index > -1)
            {
                state.recentItems.splice(index, 1);
            }

            // Add the item to the top of the recent collection.
            state.recentItems.unshift(clonedEntityInfo);

            // Limit the size of the recent collection.
            if (state.recentItems.length > 100)
            {
                state.recentItems = state.recentItems.slice(0, 101);
            }
        });

        return entityInfo;
    }
}
