import { autoinject, bindable } from "aurelia-framework";
import { Callback } from "shared/types";
import { SearchInfo } from "app/modules/search/services/search";

/**
 * Represents an item in a list of saved or recent searches.
 */
@autoinject
export class SearchItemCustomElement
{
    /**
     * The model representing the search.
     */
    @bindable
    public model: SearchInfo;

    /**
     * The function to call when the delete icon is clicked,
     * or undefined to disable the icon.
     */
    @bindable
    public deleteClick: Callback;
}
