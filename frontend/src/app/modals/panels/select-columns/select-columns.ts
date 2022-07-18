import { autoinject, computedFrom } from "aurelia-framework";
import { Modal } from "shared/framework";
import { ListViewColumn } from "app/model/list-view";

/**
 * Represents info about a column.
 */
interface IListViewColumnInfo
{
    column: ListViewColumn;
    selected: boolean;
}

/**
 * Represents the model for a `SelectColumnsPanel` instance.
 */
export interface ISelectColumnsPanelModel
{
    availableColumns: ListViewColumn[];
    selectedColumns?: ListViewColumn[];
}

/**
 * Represents a modal panel for selecting and ordering the columns that should be presented in a list.
 */
@autoinject
export class SelectColumnsPanel
{
    /**
     * Creates a new instance of the class.
     * @param modalService The `ModalService` instance.
     */
    public constructor(modal: Modal)
    {
        this._modal = modal;
    }

    private readonly _modal: Modal;
    private _result: ListViewColumn[] | undefined;

    /**
     * The list of all available columns.
     */
    protected availableColumns: ListViewColumn[];

    /**
     * The ordered list of selected columns.
     */
    protected selectedColumns: ListViewColumn[];

    /**
     * The combined list of selected and unselected columns.
     */
    @computedFrom("availableColumns.length", "selectedColumns.length")
    protected get columnInfos(): IListViewColumnInfo[]
    {
        const selectedColumns = this.selectedColumns
            .map(column => ({ column, selected: true }));

        const unselectedColumns = this.availableColumns
            .filter(c1 => !this.selectedColumns.some(c2 => c2.slug === c1.slug))
            .map(column => ({ column, selected: false }));

        return selectedColumns.concat(unselectedColumns);
    }

    /**
     * Called by the framework when the modal is activated.
     * @param model The stop to edit, or undefined to create a new stop.
     */
    public activate(model: ISelectColumnsPanelModel): void
    {
        this.availableColumns = model.availableColumns;
        this.selectedColumns = model.selectedColumns?.slice() ?? [];
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The selected list of columns
     */
    public async deactivate(): Promise<ListViewColumn[] | undefined>
    {
        return this._result;
    }

    /**
     * Called when a column is moved to a new position.
     * @param source The column being moved.
     * @param target The column currently occupying the target position.
     */
    protected onMoveColumn(source: ListViewColumn, target: ListViewColumn): void
    {
        const sourceIndex = this.selectedColumns.indexOf(source);
        const targetIndex = this.selectedColumns.indexOf(target);

        this.selectedColumns.splice(targetIndex, 0, ...this.selectedColumns.splice(sourceIndex, 1));
    }

    /**
     * Called when a column is toggled.
     * @param column The column being toggled.
     */
    protected onToggleColumn(column: ListViewColumn, selected: boolean): void
    {
        if (selected)
        {
            this.selectedColumns.push(column);
        }
        else
        {
            this.selectedColumns.splice(this.selectedColumns.indexOf(column), 1);
        }
    }

    /**
     * Called when a column type is clicked
     */
    protected async onSaveClick(): Promise<void>
    {
        this._result = this.selectedColumns;

        await this._modal.close();
    }
}
