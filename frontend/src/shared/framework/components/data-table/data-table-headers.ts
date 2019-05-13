import { autoinject } from "aurelia-framework";
import { DataTableCustomElement } from "./data-table";

/**
 * Represents the header row in a data table.
 */
@autoinject
export class DataTableHeadersCustomElement
{
    public constructor(dataTable: DataTableCustomElement)
    {
        this.dataTable = dataTable;
    }

    protected readonly dataTable: DataTableCustomElement;
}
