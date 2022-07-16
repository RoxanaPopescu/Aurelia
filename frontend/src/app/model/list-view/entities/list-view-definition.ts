import { ISorting } from "shared/types";
import { ListViewType } from "./list-view-type";
import { ListViewColumn } from "./list-view-column";
import { IListViewFilter } from "./list-view-filter";
import listViewDefinitionStrings from "./resources/strings/list-view-definition.json";

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
            this.name = data.name;
        }
        else
        {
            this.name = listViewDefinitionStrings.defaultName
        }
    }

    /**
     * The type of the list view.
     */
    public abstract type: ListViewType;

    /**
     * The ID of the list view, or undefined if not yet saved.
     */
    public id: string;

    /**
     * The name of the list view.
     */
    public name: string;

    /**
     * True if the view preset is shared with the organization, otherwise false.
     */
    public shared: boolean;

    /**
     * The filter model.
     */
    public filter: TFilter;

    /**
     * The columns to be shown.
     */
    public columns: ListViewColumn[];

    /**
     * The sorting to use for the table.
     */
    public sorting: ISorting;

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
            filters: this.filter.toJSON(),
            columns: this.columns.map(column => column.toJSON()),
            sorting: this.sorting
        };
    }
}
