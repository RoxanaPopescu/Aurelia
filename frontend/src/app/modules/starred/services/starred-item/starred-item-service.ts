import { autoinject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { ApiClient } from "shared/infrastructure";
import { EntityInfo } from "app/types/entity";
import { LocalStateService } from "app/services/local-state";

/**
 * Represents a service for managing starred items.
 */
@autoinject
export class StarredItemService
{
    /**
     * Creates a new instance of the type.
     * @param apiClient The `ApiClient` instance.
     * @param localStateService The `LocalStateService` instance.
     * @param eventAggregator The `EventAggregator` instance.
     */
    public constructor(apiClient: ApiClient, localStateService: LocalStateService, eventAggregator: EventAggregator)
    {
        this._apiClient = apiClient;
        this._localStateService = localStateService;
        this._eventAggregator = eventAggregator;
    }

    private readonly _apiClient: ApiClient;
    private readonly _localStateService: LocalStateService;
    private readonly _eventAggregator: EventAggregator;

    /**
     * Gets all items starred by the user.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the starred items.
     */
    public async getAll(signal?: AbortSignal): Promise<EntityInfo[]>
    {
        if (false)
        {
            const result = await this._apiClient.get("starred",
            {
                signal
            });

            return result.data.map((data: any) => new EntityInfo(data));
        }

        return this._localStateService.get().starredItems?.map((data: any) => new EntityInfo(data)) ?? [];
    }

    /**
     * Stars the specified entity.
     * @param entityInfo The entity info representing the entity to star.
     * @returns A promise that will be resolved with the starred item.
     */
    public async add(entityInfo: EntityInfo): Promise<EntityInfo>
    {
        if (false)
        {
            await this._apiClient.put(`starred/${entityInfo.starId}`);
        }

        this._localStateService.mutate(state =>
        {
            if (state.starredItems == null)
            {
                state.starredItems = [];
            }

            // Remove the item from the starred collection.

            const index = state.starredItems.findIndex(e => e.starId === entityInfo.starId);

            if (index > -1)
            {
                state.starredItems.splice(index, 1);
            }

            entityInfo.starred = true;

            // Add the item to the top of the starred collection.
            state.starredItems.unshift(entityInfo);
        });

        // Notify listeners that an entity was starred.
        this._eventAggregator.publish("starred-item-service:add", entityInfo);

        return entityInfo;
    }

    /**
     * Unstars the specified entity.
     * @param entityInfo The entity info representing the entity to unstar.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    public async remove(entityInfo: EntityInfo): Promise<void>
    {
        if (false)
        {
            await this._apiClient.delete(`starred/${entityInfo.starId}`);
        }

        this._localStateService.mutate(state =>
        {
            // Remove the item from the starred collection.

            const index = state.starredItems?.findIndex(e => e.starId === entityInfo.starId);

            if (index > -1)
            {
                state.starredItems.splice(index, 1);
            }

            entityInfo.starred = false;
        });

        // Notify listeners that an entity was unstarred.
        this._eventAggregator.publish("starred-item-service:remove", entityInfo);
    }
}
