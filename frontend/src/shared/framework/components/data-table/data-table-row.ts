import { autoinject, bindable, containerless } from "aurelia-framework";
import { DataTableCustomElement } from "./data-table";
import { AccentColor } from "resources/styles";

/**
 * Represents a row in a data table.
 */
@containerless
@autoinject
export class DataTableRowCustomElement
{
    public constructor(dataTable: DataTableCustomElement)
    {
        this.dataTable = dataTable;
    }

    protected readonly dataTable: DataTableCustomElement;

    /**
     * The URL to navigate to when the row is clicked, or undefined to do nothing.
     */
    @bindable
    public href: string | undefined;

    /**
     * The accent to apply to the row, or undefined to apply no accent.
     */
    @bindable
    public accent: AccentColor | undefined;

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

    /**
     * Called when an event is intercepted and needs to be stopped from propagating further.
     * @param event The event that was intercepted.
     */
    protected stopEvent(event: Event): boolean
    {
        event.stopPropagation();

        return true;
    }
}
