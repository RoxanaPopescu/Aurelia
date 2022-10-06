import { autoinject, bindable, containerless, bindingMode } from "aurelia-framework";
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
    protected selectedModel: any | this | undefined;

    /**
     * The URL to navigate to when the row is clicked, or undefined to do nothing.
     */
    @bindable
    public href: string | undefined;

    /**
     * The browsing context in which to open the specified URL.
     */
    @bindable({ defaultValue: "_self" })
    public target: "_self" | "_blank" | "_parent" | "_top";

    /**
     * The accent to apply to the row, or undefined to apply no accent.
     */
    @bindable
    public accent: AccentColor | undefined;

    /**
     * The class names to apply to the row, if any.
     */
    @bindable
    public class: string | undefined;

    /**
     * Called when the row is selected or deselected.
     */
    @bindable
    public toggle: ((context: { value: boolean }) => void) | undefined;

    /**
     * Called when the row is clicked.
     */
    @bindable
    public click: ((context: { event: MouseEvent }) => void) | undefined;

    /**
     * Called when the insert button above the row is clicked.
     */
    @bindable
    public insert: ((context: { event: MouseEvent }) => void) | undefined;

    /**
     * The model associated with the row.
     */
    @bindable
    public model: any | undefined;

    /**
     * Called when the row is moved to a new model.
     */
    @bindable
    public move: ((context: { oldModel: boolean; newModel: number }) => void) | undefined;

    /**
     * True if the row is selected, otherwise false.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay, defaultValue: false })
    public selected: boolean;

    /**
     * True if the row is faded, otherwise false.
     */
    @bindable({ defaultValue: false })
    public faded: boolean;

    /**
     * False to disable selection of the row, otherwise true.
     */
    @bindable({ defaultValue: true })
    public selectable: boolean;

    /**
     * False to explicitly make the row non-clickable, true to explicitly make it clickable,
     * and undefined to infer clickability based on the existence of a `href` or `onClick` value.
     */
    @bindable({ defaultValue: undefined })
    public clickable: boolean | undefined;

    /**
     * False to disable moving of the row, if moving is enabled for the data-table, otherwise true.
     */
    @bindable({ defaultValue: true })
    public movable: boolean;

    /**
     * False to hide the insert button above the row, otherwise false.
     */
    @bindable({ defaultValue: true })
    public insertable: boolean;

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
            this.selectedModel = this.model != null ? this.model : this;
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

    /**
     * Called when the row is clicked.
     * @param event The click event.
     * @returns False to prevent default for the event, otherwise true.
     */
    protected onClick(event: MouseEvent): boolean
    {
        if (this.clickable !== false && !event.defaultPrevented && !(event as any).__ignoreRowClick && this.click)
        {
            // Don't handle the event if it originated from a nested anchor element with an `href` attribute.
            for (const target of event.composedPath())
            {
                // Determine whether the target is an anchor element with an `href`.
                if (target instanceof HTMLAnchorElement)
                {
                    // Only consider targets within the current element.
                    if (target.classList.contains("data-table-row"))
                    {
                        break;
                    }

                    // Determine whether the anchor element has an `href`.
                    if (target.hasAttribute("href"))
                    {
                        return true;
                    }
                }
            }

            this.click({ event });

            return false;
        }

        return true;
    }

    /**
     * Called when the insert button above a row is clicked.
     * @param event The click event.
     * @returns False to prevent default for the event, otherwise true.
     */
    protected onInsertClick(event: MouseEvent): boolean
    {
        if (this.insert != null && !event.defaultPrevented)
        {
            this.insert({ event });

            return false;
        }

        return true;
    }

    /**
     * Called when the pointer is pressed on the row.
     * @param event The click event.
     */
    protected onMouseDown(event: MouseEvent): void
    {
        if (!event.defaultPrevented && this.model != null && this.dataTable.move != null && this.movable)
        {
            document.addEventListener("mouseup", this.onMouseUpAnywhere, { capture: true });

            this.dataTable.draggedModel = this.model;
        }
    }

    /**
     * Called when the pointer enters the row.
     * @param event The click event.
     */
    protected onMouseEnter(event: MouseEvent): void
    {
        if (!event.defaultPrevented && this.model != null && this.dataTable.move != null)
        {
            if (this.dataTable.draggedModel != null && this.dataTable.draggedModel !== this.model)
            {
                this.dataTable.move({ source: this.dataTable.draggedModel, target: this.model });
            }
        }
    }

    /**
     * Called when the drag handle is clicked.
     * Blocks the event from propagating.
     * @param event The click event.
     */
    protected onDragHandleClick(event: MouseEvent): void
    {
        if (this.movable)
        {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
    }

    /**
     * Called when the pointer is released anywhere.
     * @param event The click event.
     */
    protected onMouseUpAnywhere = (event: MouseEvent) =>
    {
        document.removeEventListener("mouseup", this.onMouseUpAnywhere, { capture: true });

        if (!event.defaultPrevented)
        {
            this.dataTable.draggedModel = undefined;
        }
    }
}
