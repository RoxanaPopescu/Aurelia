import clone from "clone";
import { autoinject, computedFrom } from "aurelia-framework";
import { Modal } from "shared/framework";
import { LocalStateService } from "app/services/local-state";
import { ListViewColumn, ListViewType } from "app/model/list-view";

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
    listViewType?: ListViewType;
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
     * @param localStateService The `LocalStateService` instance.
     */
    public constructor(modal: Modal, localStateService: LocalStateService)
    {
        this._modal = modal;
        this._localStateService = localStateService;
    }

    private readonly _modal: Modal;
    private readonly _localStateService: LocalStateService;
    private _result: ListViewColumn[] | undefined;

    /**
     * True if the `Save` button should be enabled, otherwise false.
     */
    protected canSaveChanges = false;

    /**
     * True if the `Set as default` button should be enabled, otherwise false.
     */
    protected canSetAsDefault = true;

    /**
     * The type of the list view for which columns are being selected,
     * or undefined to not show the `Set as default` button.
     */
    protected listViewType: ListViewType | undefined;

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
        this.listViewType = model.listViewType;
        this.availableColumns = model.availableColumns;
        this.selectedColumns = clone(model.selectedColumns) ?? [];
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

        this.canSaveChanges = true;
        this.canSetAsDefault = true;
    }

    /**
     * Called when a column is toggled.
     * @param column The column being toggled.
     * @param selected True if the column should be selected, otherwise false.
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

        this.canSaveChanges = true;
        this.canSetAsDefault = true;
    }

    /**
     * Called when all columns are toggled.
     * @param selected True if the columns should be selected, otherwise false.
     */
    protected onToggleAllColumns(selected: boolean): void
    {
        if (selected)
        {
            this.selectedColumns = this.availableColumns.slice();
        }
        else
        {
            this.selectedColumns = [];
        }

        this.canSaveChanges = true;
        this.canSetAsDefault = true;
    }

    /**
     * Called when the width of a column is changed.
     */
    protected onColumnWidthChange(): void
    {
        this.canSaveChanges = true;
        this.canSetAsDefault = true;
    }

    /**
     * Called when the `Set as default` button is clicked.
     */
    protected onSetAsDefaultClick(): void
    {
        this._localStateService.mutate(data =>
        {
            if (data.listView == null)
            {
                data.listView = {} as any;
            }

            if (data.listView[this.listViewType!] == null)
            {
                data.listView[this.listViewType!] = {} as any;
            }

            // Get the local state for list views of the relevant type.
            const localListViewState = data.listView[this.listViewType!];

            // Set the default columns.
            localListViewState.defaultColumns = this.selectedColumns;
        },
        "local");

        this.canSetAsDefault = false;
    }

    /**
     * Called when the `Save` button is clicked.
     */
    protected async onSaveClick(): Promise<void>
    {
        this._result = this.selectedColumns;

        this.canSaveChanges = false;

        await this._modal.close();
    }
}
