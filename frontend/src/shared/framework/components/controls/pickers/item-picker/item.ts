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
    private _itemPickerElement: HTMLElement;

    /**
     * True if this item represents the focused value of the item picker, otherwise false.
     */
    @computedFrom("_itemPicker.focusedValue")
    protected get active(): boolean
    {
        if (this._itemPicker != null)
        {
            return this.equals(this._itemPicker.focusedValue, this.model);
        }

        return false;
    }

    /**
     * True if this item should be visible, false if it should be hidden due to filtering.
     */
    @computedFrom("model", "_itemPicker.excludeValues", "_itemPicker.filterValue")
    public get visible(): boolean
    {
        if (this._itemPicker != null)
        {
            if (this._itemPicker.excludeValues && this._itemPicker.excludeValues.some(value => this.equals(value, this.model)))
            {
                return false;
            }

            if (this._itemPicker.filterValue && !this.contains(this._itemPicker.filterValue))
            {
                return false;
            }
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
        this._itemPickerElement = this._element.closest("item-picker") as HTMLElement;

        // Ensure the item picker element was found.
        if (this._itemPickerElement == null)
        {
            throw new Error("An 'item' must be placed within an 'item-picker'.");
        }

        // Get the view model for the item picker
        this._itemPicker = (this._itemPickerElement as any).au.controller.viewModel;

        // Attach the item to the item picker.
        this._itemPicker!.attachItem();

        // If the item is focused, ensure it is scrolled into view.
        if (this.equals(this.model, this._itemPicker!.value))
        {
            this.scrollIntoView();
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
        this.scrollIntoView();
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
     * Scrolls the item into view.
     */
    public scrollIntoView(): void
    {
        const top = this._element.offsetTop - this._element.parentElement!.offsetTop;

        if (top < this._itemPickerElement.scrollTop)
        {
            this._itemPickerElement.scrollTo({ top });
        }
        else if (top + this._element.offsetHeight > this._itemPickerElement.scrollTop + this._itemPickerElement.offsetHeight)
        {
            this._itemPickerElement.scrollTo({ top: top - this._itemPickerElement.offsetHeight + this._element.offsetHeight });
        }
    }

    /**
     * Called by the framework when the `model` property changes.
     * Re-attaches the item to the item picker.
     */
    protected modelChanged(): void
    {
        if (this._itemPicker != null)
        {
            // If the item is not disabled, attach the item to the item picker.
            this._itemPicker.attachItem();

            // If the item is focused, ensure it is scrolled into view.
            if (this.equals(this.model, this._itemPicker.value))
            {
                this.scrollIntoView();
            }
        }
    }

    /**
     * Called when the item is clicked.
     * Selects this item, setting its model as the value of the item picker,
     * and scrolling it into view if needed.
     * @returns False to prevent default.
     */
    protected onClick(): boolean
    {
        if (!this.disabled)
        {
            this._itemPicker!.changeValue(this.model, true);
        }

        this.scrollIntoView();

        return false;
    }

    /**
     * Determines whether the specified values represent the same primitive value.
     * @param value1 The first value.
     * @param value2 The second value.
     * @returns True if the values represent the same primitive value, otherwise false.
     */
    private equals(value1: any, value2: any): boolean
    {
        return (value1?.valueOf() ?? value1) === (value2?.valueOf() ?? value2);
    }
}
