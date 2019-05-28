import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { DataTableRowCustomElement } from "./data-table-row";
import { SortDirection } from "shared/types";

/**
 * Represents the sorting options for a `data-table`.
 */
export interface IDataTableSorting
{
    // The name of the property by which the items should be sorted.
    property: string;

    // The direction in which the items should be sorted.
    direction: SortDirection;
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
     * The sorting to use, or undefined to use no sorting.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public sorting: IDataTableSorting | undefined;
}
