import { autoinject } from "aurelia-framework";
import { DataTableCustomElement } from "./data-table";

/**
 * Represents the header row in a data table.
 */
@autoinject
export class DataTableHeadersCustomElement
{
    /**
     * Creates a new instance of the class.
     * @param dataTable The `data-table` to which this component belongs.
     */
    public constructor(dataTable: DataTableCustomElement)
    {
        this.dataTable = dataTable;
    }

    /**
     * The `data-table` to which this component belongs.
     */
    protected readonly dataTable: DataTableCustomElement;

    /**
     * Called when the select all option is toggled.
     */
    protected onToggleAll(): void
    {
        // Call the `toggleAll` callback function, if specified.
        if (this.dataTable.toggleAll != null)
        {
            this.dataTable.toggleAll({ value: this.dataTable.allSelected });
        }

        // Toggle all selectable rows.
        this.dataTable.rows.forEach(row =>
        {
            if (row.selectable)
            {
                row.selected = this.dataTable.allSelected;
            }
        });
    }
}
