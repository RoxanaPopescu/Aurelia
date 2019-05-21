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
        if (this.name)
        {
            const direction =
                (this.dataTable.sorting == null || this.dataTable.sorting.column !== this.name) ? "descending" :
                this.dataTable.sorting.direction === null ? "descending" :
                this.dataTable.sorting.direction === "descending" ? "ascending" :
                null;

            this.dataTable.sorting =
            {
                column: this.name,
                direction
            };
        }

        return true;
    }
}
