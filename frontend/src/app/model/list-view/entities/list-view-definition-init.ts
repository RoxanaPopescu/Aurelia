import { ISorting } from "shared/types";
import { ListViewType } from "./list-view-type";
import { ListViewFilter } from "./list-view-filter";
import { ListViewColumn } from "./list-view-column";

/**
 * Represents the data needed to create a list view definition.
 */
export interface IListViewDefinitionInit<TFilter extends ListViewFilter>
{
    /**
     * The type of the list view.
     */
    type: ListViewType;

    /**
     * The name of the list view.
     */
    name: string;

    /**
     * True if the view preset is shared with the organization, otherwise false.
     */
    shared: boolean;

    /**
     * The filter model.
     */
    filter: TFilter;

    /**
     * The columns to be shown.
     */
    columns: ListViewColumn[];

    /**
     * The sorting to use for the table.
     */
    sorting: ISorting;
}
