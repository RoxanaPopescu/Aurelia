import { DateTime } from "luxon";
import { IPaging } from "shared/types";
import { Operation } from "shared/utilities";
import { IListViewFilter } from "./list-view-filter";
import { ListViewDefinition } from "./list-view-definition";

/**
 * Represents an open list view.
 */
export class ListView<TFilter extends IListViewFilter, TItem>
{
    /**
     * Creates a new instance of the type.
     * @param listViewDefinition The list view definition.
     * @param paging The paging options to use, or undefined to use the default.
     */
    public constructor(listViewDefinition: ListViewDefinition<TFilter>, paging?: IPaging)
    {
        this.definition = listViewDefinition;

        this.paging = paging ??
        {
            page: 1,
            pageSize: 30
        };
    }

    /**
     * The list view definition.
     */
    public definition: ListViewDefinition<TFilter>;

    /**
     * The paging to use for the list.
     */
    public paging: IPaging;

    /**
     * The items to present in the list, if fetched.
     */
    public items: TItem[] | undefined;

    /**
     * The total number of items matching the query, if known.
     */
    public itemCount: number | undefined;

    /**
     * The date and time at which items were last fetched, if any.
     */
    public fetchedDateTime: DateTime | undefined;

    /**
     * The ID of the currently expanded item, if any.
     */
    public expandedItemId: string | undefined;

    /**
     * The most recent operation, if any.
     */
    public operation: Operation | undefined;

    /**
     * True if the list view definition has unsaved changes, oterwise false.
     */
    public hasUnsavedChanges = false;
}
