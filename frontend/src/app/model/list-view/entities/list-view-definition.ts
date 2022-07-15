import { ISorting } from "shared/types";
import { ListViewType } from "./list-view-type";
import { IListViewFilter } from "./list-view-filter";
import { ListViewColumn } from "./list-view-column";

/**
 * Represents the definition of a list view.
 */
export abstract class ListViewDefinition<TFilter extends IListViewFilter>
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        if (data != null)
        {
            this.id = data.id;
            this.type = data.type;
            this.name = data.name;
            this.shared = data.shared;
            this.sorting = data.sorting;
        }
        else
        {
            this.id = data.id;
            this.type = data.type;
            this.name = data.name;
            this.shared = data.shared;
            this.sorting = data.sorting;
        }
    }

    /**
     * The ID of the list view.
     */
    public id: string;

    /**
     * The type of the list view.
     */
    public type: ListViewType;

    /**
     * The name of the list view.
     */
    public name: string;

    /**
     * True if the view preset is shared with the organization, otherwise false.
     */
    public shared: boolean;

    /**
     * The sorting to use for the table.
     */
    public sorting: ISorting;

    /**
     * The filter model.
     */
    public filter: TFilter;

    /**
     * The columns to be shown.
     */
    public columns: ListViewColumn[];

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            shared: this.shared,
            sorting: this.sorting,
            filters: this.filter.toJSON(),
            columns: this.columns.map(column => column.toJSON())
        };
    }
}
