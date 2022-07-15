import { IListViewFilter } from "./list-view-filter";
import { ListViewDefinition } from "./list-view-definition";

/**
 * Represents a set of list view definitions, sourced from multiple collections.
 */
export interface IListViews<TFilter extends IListViewFilter>
{
    /**
     * The shared list views definitions.
     */
    shared: ListViewDefinition<TFilter>[];

    /**
     * The personal list views definitions.
     */
    personal: ListViewDefinition<TFilter>[];
}
