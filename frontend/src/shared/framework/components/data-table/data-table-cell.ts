import { autoinject, bindable } from "aurelia-framework";
import { DataTableCustomElement } from "./data-table";

/**
 * Represents a cell in a data table.
 */
@autoinject
export class DataTableCellCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param dataTable The data table to which the cell belongs.
     */
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
                (this.dataTable.sorting == null || this.dataTable.sorting.property !== this.name) ? "descending" :
                this.dataTable.sorting.direction === "descending" ? "ascending" :
                "descending";

            this.dataTable.sorting =
            {
                property: this.name,
                direction
            };
        }

        return true;
    }
}
