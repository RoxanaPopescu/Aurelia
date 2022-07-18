import { DateTime } from "luxon";
import { observable } from "aurelia-framework";
import { AnyPropertyChangedHandler, IPaging } from "shared/types";
import { Operation } from "shared/utilities";
import { ListViewFilter } from "./list-view-filter";
import { ListViewDefinition } from "./list-view-definition";
import { createListViewDefinition } from "../factories/list-view-definition-factory";

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
        this.hasChanges = false;

        this.paging = paging ??
        {
            page: 1,
            pageSize: 30
        };

        this.update = onChangeFunc;
    }

    private _unchangedDefinitionJson: string;
    private _hasChanges: boolean;

    /**
     * Called by the framework when an observable property changes.
     */
    public update: AnyPropertyChangedHandler | undefined;

    /**
     * The list view definition.
     */
    @observable({ changeHandler: "internalUpdate" })
    public definition: ListViewDefinition<TFilter>;

    /**
     * The paging to use for the list.
     */
    @observable({ changeHandler: "internalUpdate" })
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
     * True if the list view definition has unsaved changes, otherwise false.
     */
    public get hasChanges(): boolean
    {
        return this._hasChanges;
    }
    public set hasChanges(value: boolean)
    {
        this._hasChanges = value;

        if (!this._hasChanges)
        {
            this._unchangedDefinitionJson = JSON.stringify(this.definition);
        }
    }

    /**
     * Reverts any unsaved changes in the list view definition.
     */
    public revertChanges(): void
    {
        const unchangedDefinitionData = JSON.parse(this._unchangedDefinitionJson);

        this.definition = createListViewDefinition(unchangedDefinitionData);
        this.hasChanges = false;
    }

    /**
     * Handles internal property changes.
     * @param newValue The new property value.
     * @param oldValue The old property value.
     * @param propertyName The name of the property that changed.
     * @param source The source identifier, if relevant.
     */
    private internalUpdate = (newValue: any, oldValue: any, propertyName: string, source?: string) =>
    {
        this._hasChanges = this._unchangedDefinitionJson !== JSON.stringify(this.definition);

        const propertyPath = source ? `${source}.${propertyName}` : propertyName;

        if (newValue != null)
        {
            if (propertyPath == "definition")
            {
                this.definition.update = (...args) => this.internalUpdate(...args, "definition");
            }

            if (propertyPath == "definition" || propertyPath == "definition.filter")
            {
                this.definition.filter.update = (...args) => this.internalUpdate(...args, "definition.filter");
            }
        }

        const shouldTriggerUpdate = propertyPath != "definition.name" && propertyPath != "definition.shared";

        if (shouldTriggerUpdate && this.update != null)
        {
            this.update(newValue, oldValue, propertyPath);
        }
    };
}
