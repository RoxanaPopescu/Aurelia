import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { ItemCustomElement } from "./item";
import { EventManager } from "shared/utilities";

/**
 * Custom element representing a picker for picking an item from a list of items.
 */
@autoinject
export class ItemPickerCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     */
    public constructor(element: Element)
    {
        this._element = element as HTMLElement;
    }

    private readonly _element: HTMLElement;
    private readonly _eventManager = new EventManager(this);
    private _items: ItemCustomElement[] = [];

    /**
     * The element into which items will be projected.
     */
    protected itemsElement: HTMLElement;

    /**
     * True to highlight items when hovered, otherwise false.
     */
    protected hoverable = false;

    /**
     * The element that has input focus.
     * This must be set to enable keyboard navigation.
     */
    @bindable({ defaultValue: undefined })
    public focusedElement: HTMLElement;

    /**
     * The value of the picked item, or undefined if no item has been picked.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: any;

    /**
     * True if the picker contains no visible items, otherwise false.
     */
    @bindable({ defaultBindingMode: bindingMode.fromView })
    public empty = true;

    /**
     * The value of the focused item, or undefined if no item is focused.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public focusedValue: any;

    /**
     * True to enable keyboard navigation, otherwise false.
     */
    @bindable({ defaultValue: true })
    public keyboard: boolean;

    /**
     * True to show the `None` option, otherwise false.
     */
    @bindable({ defaultValue: true })
    public none: boolean;

    /**
     * The text to filter the items by, or undefined to apply no filter.
     */
    @bindable({ defaultValue: undefined })
    public filterValue: string | undefined;

    /**
     * The values of the items that should be excluded from the list.
     */
    @bindable({ defaultValue: undefined })
    public excludeValues: any[] | undefined;

    /**
     * Called when the user picks an item.
     */
    @bindable({ defaultValue: undefined })
    public pick: () => void;

    /**
     * Called by the framework when the component is binding.
     */
    public bind(): void
    {
        this.focusedElement = this.focusedElement || this._element;
    }

    /**
     * Called by the framework when the component is attached.
     * Ensures keyboard listeners are attached.
     */
    public attached(): void
    {
        this.keyboardChanged();
    }

    /**
     * Called when a child item is attached.
     * Updates the collection of attached items to match the items present in the DOM.
     * This approach is needed, because we cannot rely on the order in which items are attached.
     */
    public attachItem(): void
    {
        const newItems: ItemCustomElement[] = [];

        // Find all descendent elements of type `item`.
        const itemElements = this.itemsElement.querySelectorAll("item");

        // Iterate through the elements, in the order they appear in the DOM.
        itemElements.forEach((itemElement: any) =>
        {
            // Does the element have an `Aurelia` controller?
            if (itemElement.au != null && itemElement.au.controller != null)
            {
                const itemViewModel = itemElement.au.controller.viewModel;

                // Is the view model for the element of the expected type?
                if (itemViewModel instanceof ItemCustomElement)
                {
                    // Add the view model to the new list of items.
                    newItems.push(itemViewModel);
                }
            }
        });

        // Replace the list of items.
        this._items = newItems;

        // Update the `empty` state.
        this.empty = !this._items.some(i => i.visible);
    }

    /**
     * Called when a child item is detached.
     * Removes the item as a child of this item picker.
     * @param item The child item to detach.
     */
    public detachItem(item: ItemCustomElement): void
    {
        // Try to find the item in the list of items.
        const index = this._items.indexOf(item);

        // Do nothing if the item was not found.
        if (index > -1)
        {
            // Remove the item from the list of items.
            this._items.splice(index, 1);

            // Update the `empty` state.
            this.empty = !this._items.some(i => i.visible);
        }
    }

    /**
     * Changes the value of the item picker to the specified value and dispatches an `input` event,
     * and if the user picked the value, dispatches a `change` event and calls the `pick` callback.
     * @param value The new value.
     * @param pick True if the user picked the value, otherwise false.
     */
    public changeValue(value: any, pick = false): void
    {
        if (!this.equals(value, this.focusedValue))
        {
            // Set the focused value to match the new value.
            this.focusedValue = value;

            // Dispatch the `input` event to indicate that the focused value, and possibly the value, has changed.
            this._element.dispatchEvent(new CustomEvent("input", { bubbles: true, detail: { value } }));
        }

        // Did the user pick the value?
        if (pick)
        {
            if (!this.equals(this.focusedValue, this.value))
            {
                // Set the value.
                this.value = value;

                // Dispatch the `change` event to indicate that the comitted value, has changed.
                this._element.dispatchEvent(new CustomEvent("change", { bubbles: true, detail: { value } }));
            }

            // If the user picked the value, call the `pick` callback.
            if (this.pick != null)
            {
                // HACK: Delay the callback so the new value has a chance to propagate through the bindings.
                // tslint:disable-next-line: no-floating-promises
                Promise.resolve().then(() => this.pick()).catch(error => console.error(error));
            }
        }
    }

    /**
     * Scrolls the item representing the focused value into view.
     */
    public scrollToFocusedValue(): void
    {
        const item = this._items.find(i => this.equals(i.model, this.focusedValue));

        if (item != null)
        {
            item.scrollIntoView();
        }
    }

    /**
     * Called by the framework when the `keyboard` property changes.
     * Adds or removes keyboard event listeners.
     */
    protected keyboardChanged(): void
    {
        // Dispose event listeners.
        this._eventManager.removeEventListeners();

        if (this.keyboard)
        {
            // Listen for keyboard events.
            this._eventManager.addEventListener(this.focusedElement, "keydown", event => this.onKeyDown(event as KeyboardEvent));
        }
    }

    /**
     * Called by the framework when the `value` property changes.
     * Updates the `focusedValue` to match the `value`.
     */
    protected valueChanged(): void
    {
        this.focusedValue = this.value;
    }

    /**
     * Called by the framework when the `focusedValue` property changes.
     * Focuses the item representing the value.
     */
    protected focusedValueChanged(): void
    {
        const item = this._items.find(i => this.equals(i.model, this.focusedValue));

        if (item != null)
        {
            item.focus();
        }
    }

    /**
     * Called by the framework when the `filterValue` property changes.
     * Updates the `empty` state to match the visibility of the items.
     */
    protected filterValueChanged(): void
    {
        // Delay updating the empty state, in case some bindings need time to update.
        // This is specifically needed for the case where the content of an item is bound
        // to the filter value, thereby making it represent a `New item`.
        // tslint:disable-next-line: no-floating-promises
        Promise.resolve().then(() => this.empty = !this._items.some(i => i.visible));
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
        this.hoverable = true;

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
        this.hoverable = false;

        return true;
    }

    /**
     * Called by the framework when the `excludeValues` property changes.
     * Updates the empty state, based on the visibility of the items.
     */
    protected excludeValuesChanged(): void
    {
        // Update the `empty` state.
        this.empty = !this._items.some(i => i.visible);
    }

    /**
     * Called when a key is pressed within the focused element.
     * Switches to keyboard mode, where hover effects are disabled.
     * Moves the selection to the next or previous enabled item if the `ArrowUp` or `ArrowDown` keys are pressed.
     * Sets the value of the picker if the `Enter` key is pressed.
     * @param event The keyboard event.
     */
    private onKeyDown(event: KeyboardEvent): void
    {
        // The user is using the keyboard, so disable hover effects.
        this.hoverable = false;

        // Never block special keys or key combinations.
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        {
            return;
        }

        // Sets the value of the picker if the `Enter` key is pressed.
        if (event.key === "Enter")
        {
            this.changeValue(this.focusedValue, true);

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
            let index: number | undefined;

            if (this.focusedValue !== undefined)
            {
                index = this._items.findIndex(i => this.equals(i.model, this.focusedValue));
            }
            else if (this.none)
            {
                index = 0;
            }

            if (index == null)
            {
                index = offset === 1 ? -1 : this._items.length;
            }

            do
            {
                index += offset;
            }
            while (this._items[index] != null && (this._items[index].disabled || !this._items[index].visible ||
                (this.filterValue && !this._items[index].contains(this.filterValue))));

            if (this._items[index] != null)
            {
                this._items[index].focus();
            }

            event.preventDefault();
        }
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
