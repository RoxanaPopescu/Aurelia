import { autoinject, bindable } from "aurelia-framework";
import { EntityInfo } from "app/types/entity";
import { StarredItemService } from "app/modules/starred/services/starred-item";

/**
 * Represents an icon that shows the starred state of an entity,
 * and allows the user to star or unstar the entityl.
 */
@autoinject
export class StarIcon
{
    /**
     * Creates a new instance of the type.
     * @param starredItemService The `StarredItemService` instance.
     */
    public constructor(starredItemService: StarredItemService)
    {
        this._starredItemService = starredItemService;
    }

    private readonly _starredItemService: StarredItemService;

    /**
     *  The `EntityInfo` instance representing the entity.
     */
    protected entityInfo: EntityInfo;

    /**
     * The entity for which the starred state should be presented.
     */
    @bindable
    public entity: { toEntityInfo(): EntityInfo };

    /**
     * Called by the framework when the `entity` property changes.
     * Gets an `EntityInfo` instance representing the entity.
     */
    protected entityChanged(): void
    {
        this.entityInfo = this.entity.toEntityInfo();
    }

    /**
     * Called when the `star` icon is clicked.
     * Toggles the starred state of the entity.
     */
    protected async onClick(): Promise<void>
    {
        if (this.entityInfo.starred)
        {
            // Unstar the entity.
            await this._starredItemService.remove(this.entityInfo);
        }
        else
        {
            // Star the entity.
            await this._starredItemService.add(this.entityInfo);
        }
    }
}
