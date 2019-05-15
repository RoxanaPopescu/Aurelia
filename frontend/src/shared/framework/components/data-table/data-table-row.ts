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
     * The selected model, used when binding the radio button in `single` selection model.
     */
    protected selectedModel: this | undefined;

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
    public toggle: (({ value: boolean }) => void) | undefined;

    /**
     * True if the row is selected, otherwise false.
     */
    @bindable({ defaultValue: false })
    public selected: boolean;

    /**
     * False to disable selection of the row, otherwise true.
     */
    @bindable({ defaultValue: true })
    public selectable: boolean;

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        this.dataTable.rows.add(this);
    }

    /**
     * Called by the framework when the component is detached.
     */
    public detached(): void
    {
        this.dataTable.rows.delete(this);
    }

    /**
     * Called when the `selected` property changes.
     */
    protected selectedChanged(): void
    {
        if (this.selected)
        {
            // Set the selected model, used when binding a radio button.
            this.selectedModel = this;
        }
        else
        {
            // Set the selected model, used when binding a radio button.
            this.selectedModel = undefined;

            // If deselected, also ensure the select all option is also deselected.
            this.dataTable.allSelected = false;
        }
    }

    /**
     * Called when an event is intercepted and needs to be stopped from propagating further.
     * @param event The event that was intercepted.
     */
    protected stopEvent(event: Event): boolean
    {
        event.stopPropagation();

        return true;
    }

    /**
     * Called when the selected state of the row is toggled.
     * @param value True if the row is selected, otherwise false.
     */
    protected onToggle(value: boolean): boolean
    {
        // In `single` selection mode, deselect all selectable rows.
        if (this.dataTable.selection === "single")
        {
            this.dataTable.rows.forEach(row =>
            {
                if (row.selectable)
                {
                    row.selected = false;
                }
            });
        }

        // Select this row.
        this.selected = value;

        // Call the `toggle` callback function, if specified.
        if (this.toggle != null)
        {
            this.toggle({ value: this.selected });
        }

        return true;
    }
}
