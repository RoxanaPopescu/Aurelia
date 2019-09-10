import { autoinject, bindable, computedFrom } from "aurelia-framework";
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
    private _itemPicker: ItemPickerCustomElement | undefined;

    /**
     * True if this item represents the focused value of the item picker, otherwise false.
     */
    @computedFrom("_itemPicker.focusedValue")
    protected get active(): boolean
    {
        if (this._itemPicker != null)
        {
            return this._itemPicker.focusedValue === this.model;
        }

        return false;
    }

    /**
     * True if this item should be visible, false if it should be hidden due to filtering.
     */
    @computedFrom("_itemPicker.filterValue")
    public get visible(): boolean
    {
        if (this._itemPicker != null && this._itemPicker.filterValue)
        {
            return this.contains(this._itemPicker.filterValue);
        }

        return true;
    }

    /**
     * The value associated with the element.
     */
    @bindable
    public model: any;

    /**
     * True if the item is disabled, otherwise false.
     */
    @bindable({ defaultValue: false })
    public disabled: boolean;

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
        this._itemPicker = (itemPickerElement as any).au.controller.viewModel;

        // If the item is not disabled, attach the item to the item picker.
        this._itemPicker!.attachItem(this);

        // If the item is focused, ensure it is scrolled into view.
        if (this.model === this._itemPicker!.value)
        {
            this._element.scrollIntoView({ block: "nearest" });
        }
    }

    /**
     * Called by the framework when the component is detached.
     * Detaches the item from the item picker.
     */
    public detached(): void
    {
        this._itemPicker!.detachItem(this);
    }

    /**
     * Sets the model of this item as the focused value of the item picker,
     * scrolling it into view if needed.
     */
    public focus(): void
    {
        this._itemPicker!.changeValue(this.model);
        this._element.scrollIntoView({ block: "nearest" });
    }

    /**
     * Queries the DOM for the item, to determine whether it includes the specified text.
     * Note that the comparison is case insensitive, and that any whitespace is collapsed to a single space.
     * @param text The text to look for in the item.
     * @returns True if the item contains the specified text, otherwise false.
     */
    public contains(text: string): boolean
    {
        const elements: Element[] = [this._element];

        let innerText = "";

        while (elements.length > 0)
        {
            const element = elements.shift()!;

            if (element.textContent)
            {
                innerText += ` ${element.textContent}`;
            }

            elements.push(...Array.from(element.children));
        }

        const searchText = text.replace(/([^\w]|_)+/g, " ").trim().toLowerCase();
        innerText = innerText.replace(/([^\w]|_)+/g, " ").trim().toLowerCase();

        return innerText.includes(searchText);
    }

    /**
     * Called when the item is clicked.
     * Selects this item and sets its model as the value of the item picker.
     * @returns False to prevent default.
     */
    protected onClick(): boolean
    {
        if (!this.disabled)
        {
            this._itemPicker!.changeValue(this.model, true);
        }

        return false;
    }
}
