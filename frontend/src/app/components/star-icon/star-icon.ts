import { autoinject, bindable } from "aurelia-framework";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
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
     * @param eventAggregator The `EventAggregator` instance.
     */
    public constructor(starredItemService: StarredItemService, eventAggregator: EventAggregator)
    {
        this._starredItemService = starredItemService;
        this._eventAggregator = eventAggregator;
    }

    private readonly _starredItemService: StarredItemService;
    private readonly _eventAggregator: EventAggregator;
    private _subscriptions: Subscription[];

    /**
     *  The `EntityInfo` instance representing the entity.
     */
    protected model: EntityInfo;

    /**
     * The entity for which the starred state should be presented.
     */
    @bindable
    public entity: { toEntityInfo(): EntityInfo };

    /**
     * Called by the framework when the component is binding.
     * @param bindingContext The binding context
     * @param overrideContext The override context.
     */
    public bind(bindingContext: any, overrideContext: any): void
    {
        this._subscriptions =
        [
            // Listen for entities being starred, and update if needed.
            this._eventAggregator.subscribe("starred-item-service:add", entityInfo =>
            {
                if (entityInfo.starId === this.model.starId)
                {
                    this.model.starred = true;
                }
            }),

            // Listen for entities being unstarred, and update if needed.
            this._eventAggregator.subscribe("starred-item-service:remove", entityInfo =>
            {
                if (entityInfo.starId === this.model.starId)
                {
                    this.model.starred = false;
                }
            })
        ];
    }

    /**
     * Called by the framework when the component is unbinding.
     */
    public unbind(): void
    {
        this._subscriptions.forEach(s => s.dispose());
    }

    /**
     * Called by the framework when the `entity` property changes.
     * Gets an `EntityInfo` instance representing the entity.
     */
    protected entityChanged(): void
    {
        this.model = this.entity.toEntityInfo();
    }

    /**
     * Called when the `star` icon is clicked.
     * Toggles the starred state of the entity.
     */
    protected async onClick(): Promise<void>
    {
        if (this.model.starred)
        {
            // Unstar the entity.
            await this._starredItemService.remove(this.model);
        }
        else
        {
            // Star the entity.
            await this._starredItemService.add(this.model);
        }
    }
}
