import { autoinject, bindable } from "aurelia-framework";
import { DataTableCustomElement } from "./data-table";

/**
 * Represents a row in a data table.
 */
@autoinject
export class DataTableRowCustomElement
{
    public constructor(dataTable: DataTableCustomElement)
    {
        this.dataTable = dataTable;
    }

    protected readonly dataTable: DataTableCustomElement;

    @bindable
    public href: string | undefined;

    /**
     * Called when the row is selected or deselected.
     */
    @bindable
    public toggle: () => void;

    /**
     * True id the row is selected, otherwise false.
     */
    @bindable({ defaultValue: false })
    public selected: boolean;

    /**
     * False to disable selection of the row, otherwise true.
     */
    @bindable({ defaultValue: true })
    public selectable: boolean;
}
