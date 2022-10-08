import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { DataTableRowCustomElement } from "./data-table-row";
import { ISorting } from "shared/types";

/**
 * Represents a data table.
 */
@autoinject
export class DataTableCustomElement
{
    /**
     * The rows within this `data-table`.
     */
    public readonly rows = new Set<DataTableRowCustomElement>();

    /**
     * The model for the rows currently being dragged, if any.
     */
    public draggedModel: any | undefined;

    /**
     * The selection mode to use.
     */
    @bindable({ defaultValue: "none" })
    public selection: "none" | "single" | "multiple";

    /**
     * Called when the select all option is checked or unchecked.
     */
    @bindable
    public toggleAll: ((context: { value: boolean }) => void) | undefined;

    /**
     * Called when one or more rows are moved to a new position in the list.
     */
    @bindable
    public move: ((context: { source: any; target: any }) => void) | undefined;

    /**
     * Called when the insert button below the last row is clicked.
     */
    @bindable
    public insert: ((context: { event: MouseEvent }) => void) | undefined;

    /**
     * The insert mode to use, which controls the presence and appearance
     * of the insert button below the last row.
     */
    @bindable({ defaultValue: "append" })
    public insertMode: "append" | "insert" | "none";

    /**
     * True if the select all option is checked, otherwise false.
     */
    @bindable({ defaultValue: false })
    public allSelected: boolean;

    /**
     * True if busy, e.g. while loading data, otherwise false.
     */
    @bindable({ defaultValue: false })
    public busy: boolean;

    /**
     * The sorting to use, or undefined to use no sorting.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public sorting: ISorting | undefined;
}
