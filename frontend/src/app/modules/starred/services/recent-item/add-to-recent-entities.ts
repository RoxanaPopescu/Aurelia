import { Container } from "aurelia-framework";
import { EntityInfo, EntityInfoData } from "app/types/entity";
import { RecentItemService } from "./recent-item-service";

/**
 * Adds the specified entity to the collection of recent entities.
 * @param entity The entity to add.
 * @returns True if the entity is starred, otherwise false.
 */
export function addToRecentEntities(entityInfo: EntityInfoData): void
{
    const entityInfoInstance = entityInfo instanceof EntityInfo ? entityInfo : new EntityInfo(entityInfo);

    Container.instance.get(RecentItemService).add(entityInfoInstance)
        .catch(error => console.log(error));
}
