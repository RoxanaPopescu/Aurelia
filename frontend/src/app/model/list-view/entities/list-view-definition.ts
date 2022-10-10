import { observable } from "aurelia-framework";
import { AnyPropertyChangedHandler, ISorting } from "shared/types";
import { ListViewType } from "./list-view-type";
import { ListViewColumn } from "./list-view-column";
import { ListViewFilter } from "./list-view-filter";

/**
 * Represents the definition of a list view.
 */
export abstract class ListViewDefinition<TFilter extends ListViewFilter>
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
    }

    /**
     * Called by the framework when an observable property changes.
     * Note that this will be assigned by the `ListView` instance.
     */
    public update: AnyPropertyChangedHandler | undefined;

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
     @observable({ changeHandler: "update" })
    public name: string;

    /**
     * True if the view preset is shared with the organization, otherwise false.
     */
     @observable({ changeHandler: "update" })
    public shared: boolean;

    /**
     * The filter model.
     */
    @observable({ changeHandler: "update" })
    public filter: TFilter;

    /**
     * The columns to be shown.
     */
    @observable({ changeHandler: "update" })
    public columns: ListViewColumn[];

    /**
     * The sorting to use for the table.
     */
    @observable({ changeHandler: "update" })
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
            filter: this.filter.toJSON(),
            columns: this.columns.map(column => column.toJSON()),
            sorting: this.sorting
        };
    }
}
