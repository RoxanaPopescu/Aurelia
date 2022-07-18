import { DateTime } from "luxon";
import { observable } from "aurelia-framework";
import { AnyPropertyChangedHandler, IPaging } from "shared/types";
import { Operation } from "shared/utilities";
import { ListViewFilter } from "./list-view-filter";
import { ListViewDefinition } from "./list-view-definition";

/**
 * Represents an open list view.
 */
export class ListView<TFilter extends ListViewFilter, TItem>
{
    /**
     * Creates a new instance of the type.
     * @param listViewDefinition The list view definition.
     * @param paging The paging options to use, or undefined to use the default.
     * @param onChangeFunc The function to call when a property change requires the list view to update.
     */
    public constructor(listViewDefinition: ListViewDefinition<TFilter>, paging?: IPaging, onChangeFunc?: AnyPropertyChangedHandler)
    {
        this.definition = listViewDefinition;
        this.hasUnsavedChanges = false;

        this.paging = paging ??
        {
            page: 1,
            pageSize: 30
        };

        this.update = onChangeFunc;

        const innerUpdateFunc = (source, newValue, oldValue, propertyName) =>
        {
            this._hasUnsavedChanges = this._definitionJson !== JSON.stringify(this.definition);

            const propertyPath = `${source}.${propertyName}`;

            if (this.update != null && propertyPath != "definition.name" && propertyPath != "definition.shared")
            {
                this.update(newValue, oldValue, propertyPath);
            }
        };

        this.definition.update = innerUpdateFunc.bind(this, "definition");
        this.definition.filter.update = innerUpdateFunc.bind(this, "definition.filter");
    }

    private _definitionJson: string;
    private _hasUnsavedChanges: boolean;

    /**
     * Called by the framework when an observable property changes.
     */
    public update: AnyPropertyChangedHandler | undefined;

    /**
     * The list view definition.
     */
    @observable({ changeHandler: "update" })
    public definition: ListViewDefinition<TFilter>;

    /**
     * The paging to use for the list.
     */
    @observable({ changeHandler: "update" })
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
    public get hasUnsavedChanges(): boolean
    {
        return this._hasUnsavedChanges;
    }
    public set hasUnsavedChanges(value: boolean)
    {
        this._hasUnsavedChanges = value;

        if (!this._hasUnsavedChanges)
        {
            this._definitionJson = JSON.stringify(this.definition);
        }
    }

    /**
     * The scroll position associated with the list view.
     */
    public scrollPosition: ScrollToOptions;
}
