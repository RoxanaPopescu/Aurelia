import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { DataTableRowCustomElement } from "./data-table-row";

/**
 * Represents the sorting options for a `data-table`.
 */
export interface IDataTableSorting
{
    // The name of the column by which the rows should be sorted.
    column: string;

    // The direction in which the rows should be sorted.
    direction: string | null;
}

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
     * True if the select all option is checked, otherwise false.
     */
    @bindable({ defaultValue: false })
    public allSelected: boolean;

    /**
     * The sorting options to use.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public sorting: IDataTableSorting;
}
