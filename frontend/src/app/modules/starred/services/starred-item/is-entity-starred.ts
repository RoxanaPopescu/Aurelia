import { Container } from "aurelia-framework";
import { EntityTypeSlug } from "app/types/entity";
import { LocalStateService } from "app/services/local-state";
import { debounce as debounceFunc } from "shared/utilities";

// Debounced function that gets all items starred by the user.
const debouncedGetStarredItems = debounceFunc(() =>
    Container.instance.get(LocalStateService).get().starredItems, 300, { leading: true });

/**
 * Determines whether the entity of the specified type, with the specified ID, is starred.
 * @param type The type of the entity.
 * @param id The ID of the entity.
 * @param debounce True to debounce reads from storage, false to always read the latest state.
 * @returns True if the entity is starred, otherwise false.
 */
export function isEntityStarred(type: EntityTypeSlug, id: string, debounce = true): boolean
{
    const starredItems = debounce ? debouncedGetStarredItems() : debouncedGetStarredItems.flush();

    return starredItems?.some(e => e.type.slug === type && e.id === id) ?? false;
}
