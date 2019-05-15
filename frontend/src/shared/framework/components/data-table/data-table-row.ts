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
     * Called when the selected state of the row is toggled.
     * @param event The event that caused the toggle.
     */
    protected onToggle(event: Event): boolean
    {
        if (this.selectable)
        {
            // Get the selection state of this row.
            const selected = this.selected;

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

            // Toggle the selection state of this row.
            this.selected = !selected;

            // Call the `toggle` callback function, if specified.
            if (this.toggle != null)
            {
                this.toggle({ value: this.selected });
            }
        }

        // Prevent the event from triggering navigation if the row is a link,
        // but allow it to toggle the state of the checkbox or radio input.

        event.stopPropagation();

        return event.target instanceof HTMLInputElement;
    }
}
