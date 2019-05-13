import { autoinject, bindable } from "aurelia-framework";
import { DataTableCustomElement } from "./data-table";

/**
 * Represents a cell in a data table.
 */
@autoinject
export class DataTableCellCustomElement
{
    public constructor(dataTable: DataTableCustomElement)
    {
        this.dataTable = dataTable;
    }

    protected readonly dataTable: DataTableCustomElement;

    /**
     * The name of the cell, if used as a header.
     */
    @bindable
    public name: string | undefined;

    /**
     * The horizontal alignment to use.
     */
    @bindable({ defaultValue: "left"})
    public align: "left" | "right" | "center";

    /**
     * Called when the cell is clicked.
     */
    protected onClick(): boolean
    {
        if (this.name && this.dataTable.sorting[this.name] !== undefined)
        {
            this.dataTable.sorting[this.name] =
                this.dataTable.sorting[this.name] === null ? "ascending" :
                this.dataTable.sorting[this.name] === "ascending" ? "descending" :
                null;
        }

        return true;
    }
}
