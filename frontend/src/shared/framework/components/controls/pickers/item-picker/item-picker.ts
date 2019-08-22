import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { ItemCustomElement } from "./item";
import { EventManager } from "shared/utilities";

/**
 * Custom element representing a picker for picking an item from a list of items.
 */
@autoinject
export class ItemPickerCustomElement
{
    private readonly _eventManager = new EventManager(this);
    private readonly _items: ItemCustomElement[] = [];

    /**
     * True to show a hover effect when the mouse is over an item, otherwise false.
     */
    protected hoverEnabled = false;

    /**
     * The element that has focus, if different from the element representing this component.
     */
    @bindable
    public focusedElement: HTMLElement;

    /**
     * The value of the picked item, or undefined if no item has been picked.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: any;

    /**
     * The value of the focused item, or undefined if no item is focused.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public focusedValue: any;

    /**
     * The text to filter the items by, or undefined to apply no filter.
     */
    @bindable
    public filter: string | undefined;

    /**
     * Called when the user picks an item.
     */
    @bindable
    public change: () => void;

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        // Listen for interaction events, that might indicate that the dropdown should close.
        this._eventManager.addEventListener(this.focusedElement, "keydown", event => this.onKeyDown(event as KeyboardEvent));
    }

    /**
     * Called by the framework when the component is detached.
     */
    public detached(): void
    {
        // Dispose event listeners.
        this._eventManager.removeEventListeners();
    }

    /**
     * Called when a child item is attached.
     * Adds the item as a child of this item picker.
     * @param item The child item to attach.
     */
    public attachItem(item: ItemCustomElement): void
    {
        this._items.push(item);
    }

    /**
     * Called when a child item is detached.
     * Removes the item as a child of this item picker.
     * @param item The child item to detach.
     */
    public detachItem(item: ItemCustomElement): void
    {
        this._items.splice(this._items.indexOf(item), 1);
    }

    /**
     * Sets the specified value as the value of the item picker,
     * and calls the `change` callback, if specified.
     */
    public setValue(value: any): void
    {
        // Set the value of the item picker.
        this.value = value;

        // Call the `change` callback of the item picker, if specified.
        if (this.change != null)
        {
            this.change();
        }
    }

    /**
     * Called by the framework when the `value` property changes.
     * Updates the `focusedValue`to match the `value`.
     */
    protected valueChanged(): void
    {
        this.focusedValue = this.value;
    }

    /**
     * Called when the mouse is moved over the item picker.
     * Switches to mouse mode, where hover effects are enabled.
     * @param event The keyboard event.
     * @returns True to continue.
     */
    protected onMouseMove(): boolean
    {
        // The user is using the mouse, so enable hover effects.
        this.hoverEnabled = true;

        return true;
    }

    /**
     * Called when the mouse leaves the item picker.
     * Switches to keyboard mode, where hover effects are disabled.
     * @param event The keyboard event.
     * @returns True to continue.
     */
    protected onMouseLeave(): boolean
    {
        // The user is not using the mouse, so disable hover effects.
        this.hoverEnabled = false;

        return true;
    }

    /**
     * Called when a key is pressed within the focused element.
     * Switches to keyboard mode, where hover effects are disabled.
     * Moves the selection to the next or previous item if the `ArrowUp` or `ArrowDown` keys are pressed.
     * Sets the value of the picker if the `Enter` key is pressed.
     * @param event The keyboard event.
     */
    private onKeyDown(event: KeyboardEvent): void
    {
        // The user is using the keyboard, so disable hover effects.
        this.hoverEnabled = false;

        // Sets the value of the picker if the `Enter` key is pressed.
        if (event.key === "Enter")
        {
            this.setValue(this.focusedValue);

            event.preventDefault();

            return;
        }

        // Moves the selection to the next or previous item if the `ArrowUp` or `ArrowDown` keys are pressed.

        const offset =
            event.key === "ArrowUp" ? -1 :
            event.key === "ArrowDown" ? 1 :
            undefined;

        if (offset)
        {
            if (this.focusedValue != null)
            {
                const currentIndex = this._items.findIndex(i => i.model === this.focusedValue);
                const newIndex = Math.min(Math.max(currentIndex + offset, 0), this._items.length - 1);
                this._items[newIndex].focus();
            }
            else if (this._items.length > 0)
            {
                this._items[0].focus();
            }

            event.preventDefault();
        }
    }
}
