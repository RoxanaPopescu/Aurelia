import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { Callback } from "shared/types";
import { EntityInfo } from "app/types/entity";

/**
 * Represents an item in a list of search results.
 */
@autoinject
export class SearchResultCustomElement
{
    /**
     * The model representing the search result.
     */
    @bindable
    public model: EntityInfo;

    /**
     * True to show the type of the search result, otherwise false.
     */
    @bindable({ defaultValue: true })
    public showType: boolean;

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
