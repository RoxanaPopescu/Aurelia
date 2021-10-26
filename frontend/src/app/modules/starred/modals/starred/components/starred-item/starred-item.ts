import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { Callback } from "shared/types";
import { EntityInfo } from "app/types/entity";

/**
 * Represents an item in a list of starred items.
 */
@autoinject
export class StarredItemCustomElement
{
    /**
     * The model representing the starred item.
     */
    @bindable
    public model: EntityInfo;

    /**
     * The function to call when the star icon is clicked,
     * or undefined to disable the icon.
     */
    @bindable
    public starClick: Callback;

    /**
     * The ancestors of this entitity, ordered from furthest to closest.
     */
    @computedFrom("model")
    protected get ancestors(): EntityInfo[]
    {
        const ancestors: EntityInfo[] = [];

        let entity = this.model;

        while (entity.parent)
        {
            ancestors.unshift(entity.parent);
            entity = entity.parent;
        }

        return ancestors;
    }
}
