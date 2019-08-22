import { autoinject, bindable } from "aurelia-framework";
import { ItemPickerCustomElement } from "./item-picker";

/**
 * Custom element representing an item in an item picker.
 */
@autoinject
export class ItemCustomElement
{
    /**
     * Creates a new instance of the class.
     * @param element The element representing the component.
     */
    public constructor(element: Element)
    {
        this._element = element as HTMLElement;
    }

    private readonly _element: HTMLElement;

    /**
     * The item picker to which this component belongs.
     */
    protected itemPicker: ItemPickerCustomElement;

    /**
     * The value associated with the element.
     */
    @bindable
    public model: any;

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        // Find the closest item picker.
        const itemPickerElement = this._element.closest("item-picker");

        // Ensure the item picker element was found.
        if (itemPickerElement == null)
        {
            throw new Error("An 'item' must be placed within an 'item-picker'.");
        }

        // Get the view model for the item picker
        this.itemPicker = (itemPickerElement as any).au.controller.viewModel;

        // Attach the item to the item picker.
        this.itemPicker.attachItem(this);

        // If the item is selected, ensure it is scrolled into view.
        if (this.model === this.itemPicker.value)
        {
            this._element.scrollIntoView({ block: "center" });
        }
    }

    /**
     * Called by the framework when the component is detached.
     */
    public detached(): void
    {
        // Dettach the item from the item picker.
        this.itemPicker.detachItem(this);
    }

    /**
     * Sets this item as the focused item in the item picker,
     * scrolling it into view if needed.
     */
    public focus(): void
    {
        this.itemPicker.focusedValue = this.model;
        this._element.scrollIntoView({ block: "nearest" });
    }

    /**
     * Called when the item is clicked.
     * Selects this item and sets its model as the value of the item picker.
     */
    protected onClick(): void
    {
        // Set the value of the item picker.
        this.itemPicker.setValue(this.model);
    }
}
