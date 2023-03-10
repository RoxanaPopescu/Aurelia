import { Placement } from "popper.js";
import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { LabelPosition, shouldFocusInput } from "../../control";
import { AutocompleteHint, EnterKeyHint } from "../input";
import { ItemPickerCustomElement } from "../../pickers/item-picker/item-picker";

/**
 * Custom element representing an input for picking one or more items from a list.
 */
@autoinject
export class TagsInputCustomElement
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

    /**
     * The element representing the input.
     */
    protected inputElement: HTMLElement;

    /**
     * The element representing the toggle icon.
     */
    protected toggleElement: HTMLElement;

    /**
     * The view model for the item picker.
     */
    protected itemPicker: ItemPickerCustomElement;

    /**
     * Gets the input value.
     */
    @computedFrom("open", "new", "filter", "filterValue")
    protected get inputValue(): string
    {
        if ((this.new || this.filter !== "off") && this.filterValue != null)
        {
            return this.filterValue;
        }

        return "";
    }

    /**
     * Sets the input value.
     */
    protected set inputValue(value: string)
    {
        if (value)
        {
            this.filterValue = value;
        }
        else
        {
            this.filterValue = undefined;
        }

        if (this.new)
        {
            this.focusedValue = value;
        }
    }

    /**
     * The position of the label, or undefined to show no label.
     */
    @bindable({ defaultValue: undefined })
    public label: LabelPosition | undefined;

    /**
     * The models associated with the items picked by the user, or undefined if no items have been picked.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public value: any[] | undefined;

    /**
     * The value of the item that is focused, but not yet picked, or undefined if no item has been focused.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public focusedValue: any | undefined;

    /**
     * The type of filtering to use, where `off` means no filtering, `auto` means filtering based on
     * the text presented in the items, and `custom` means that the input element is enabled, but the
     * actual filtering the items is an external concern.
     */
    @bindable({ defaultValue: "off" })
    public filter: "off" | "auto" | "custom";

    /**
     * The value entered in the input element, or undefined if no value is entered.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public filterValue: string | undefined;

    /**
     * True to show the `New tag` option, otherwise false.
     */
    @bindable({ defaultValue: false })
    public new: boolean;

    /**
     * True if the dropdown is open, otherwise false.
     */
    @bindable({ defaultValue: false, defaultBindingMode: bindingMode.fromView })
    public open: boolean;

    /**
     * True if the input is disabled, otherwise false.
     */
    @bindable({ defaultValue: false })
    public disabled: boolean;

    /**
     * True if the input is readonly, otherwise false.
     */
    @bindable({ defaultValue: false })
    public readonly: boolean;

    /**
     * The autocomplete mode to use,
     * or undefined to use the default behavior.
     */
    @bindable({ defaultValue: "off" })
    public autocomplete: AutocompleteHint;

    /**
     * True to select the contents when the input is focused, otherwise false.
     */
    @bindable({ defaultValue: false })
    public autoselect: boolean;

    /**
     * The hint indicating the type of `Enter` key to show on a virtual keyboard,
     * or undefined to use the default behavior.
     */
    @bindable({ defaultValue: undefined })
    public enterkey: EnterKeyHint | undefined;

    /**
     * True to use `fixed` positioning for the dropdown, otherwise false.
     * This may be needed if the dropdown is placed within a container that
     * hides overflowing content, but note that it has a performance cost.
     */
    @bindable({ defaultValue: false })
    public fixed: boolean;

    /**
     * The placement of the dropdown, relative to its owner.
     */
    @bindable({ defaultValue: "bottom-start" })
    public placement: Placement;

    /**
     * Called by an item when it wants to remove itself from the value.
     * Removes the model associated with the item from the value.
     * @param model The model associated with the item.
     */
    public deselectItem(model: any): void
    {
        const value = [...this.value!];
        const index = value.indexOf(model);
        value.splice(index, 1);

        if (value.length > 0)
        {
            this.value = value;
        }
        else
        {
            this.value = undefined;
        }

        // Dispatch the `input` event to indicate that the comitted value, has changed.
        this._element.dispatchEvent(new CustomEvent("input", { bubbles: true, detail: { value: this.value } }));

        // Dispatch the `change` event to indicate that the comitted value, has changed.
        this._element.dispatchEvent(new CustomEvent("change", { bubbles: true, detail: { value: this.value } }));
    }

    /**
     * Opens the dropdown and optionally focuses the input element.
     * @param focusInput True to focus the input element, otherwise false.
     */
    protected openDropdown(focusInput: boolean): void
    {
        this.open = true;
        this.focusedValue = undefined;

        if (focusInput && shouldFocusInput())
        {
            this.inputElement.focus();
            setTimeout(() => this.inputElement.focus());
        }
    }

    /**
     * Closes the dropdown, clears the filter value and optionally focuses the toggle icon.
     * Also reverts the focused value if no value was picked.
     * @param focusToggle True to focus the toggle icon, otherwise false.
     * @param pick True if the user picked a value, otherwise false.
     * @param keepOpen True to keep the dropdown open, otherwise false.
     */
    protected closeDropdown(focusToggle: boolean, pick = false, keepOpen = false): void
    {
        if (!keepOpen)
        {
            this.open = false;
        }

        // Determine whether the picked value is a new value.
        const isNewValue = this.new && this.filterValue && !this.value?.includes(this.filterValue) && this.filterValue === this.focusedValue;

        if (!keepOpen || isNewValue)
        {
            this.filterValue = undefined;
        }

        if (pick && this.focusedValue && !this.value?.includes(this.focusedValue))
        {
            // To ensuere a binding update is triggered, replace the
            // value with a new array including the picked value.
            const value = this.value != null ? [...this.value] : [];
            value.push(this.focusedValue);
            this.value = value;

            // Dispatch the `input` event to indicate that the comitted value, has changed.
            this._element.dispatchEvent(new CustomEvent("input", { bubbles: true, detail: { value: this.value } }));

            // Dispatch the `change` event to indicate that the comitted value, has changed.
            this._element.dispatchEvent(new CustomEvent("change", { bubbles: true, detail: { value: this.value } }));
        }

        this.focusedValue = undefined;

        if (focusToggle && !pick)
        {
            this.toggleElement.focus();
            setTimeout(() => this.toggleElement.focus());
        }
    }

    /**
     * Called when the toggle icon is clicked, and if filtering is disabled, when the input element is clicked.
     * Toggles the dropdown between its open and closed state, focusing either the input element or toggle icon.
     */
    protected toggleDropdown(): void
    {
        if (this.open)
        {
            this.closeDropdown(true, true);
        }
        else
        {
            this.openDropdown(true);
        }
    }

    /**
     * Called when a key is pressed within the input element.
     * Deletes the last tag when `Backspace` is pressed while the input is empty.
     * @param event The keyboard event.
     * @returns True to continue, false to prevent default.
     */
    protected onInputKeyDown(event: KeyboardEvent): boolean
    {
        if (event.defaultPrevented)
        {
            return true;
        }

        if (!(event.altKey || event.metaKey || event.shiftKey || event.ctrlKey))
        {
            switch (event.key)
            {
                case "Backspace":
                {
                    if (this.open && !this.filterValue && this.value != null && this.value.length > 0)
                    {
                        this.open = false;

                        return false;
                    }

                    if (!this.open && this.value != null)
                    {
                        this.value.pop();

                        return false;
                    }

                    break;
                }

                case "Enter":
                {
                    if (!this.open)
                    {
                        this.openDropdown(true);

                        return false;
                    }

                    break;
                }
            }
        }

        this.open = true;

        return true;
    }

    /**
     * Called when the input element is clicked.
     * Opens the dropdown and focuses the input element.
     * @param event The mouse event.
     * @returns True to continue.
     */
    protected onInputMouseDown(event: MouseEvent): boolean
    {
        if (!event.defaultPrevented)
        {
            if (event.composedPath().some((e: HTMLElement) => e.nodeName === "TAG"))
            {
                if (shouldFocusInput())
                {
                    this.inputElement.focus();
                    setTimeout(() => this.inputElement.focus());
                }
            }
            else
            {
                if (!this.open)
                {
                    this.openDropdown(true);
                }
                else if (!this.new && this.filter === "off")
                {
                    this.closeDropdown(false);
                }
            }
        }

        return true;
    }

    /**
     * Called when a `mousedown` event occurs on the dropdown.
     * Prevents default for the event, so it won't cause unwanted effects in ancestor elements.
     * @returns False to prevent default.
     */
    protected onDropdownMouseDown(): boolean
    {
        return false;
    }

    /**
     * Called when the value is clicked.
     * Prevents the click from focusing the input and opening the dropdown.
     * @returns False to prevent default.
     */
    protected onValueMouseDown(): boolean
    {
        return false;
    }

    /**
     * Called when the input, or an element within the input, receives focus.
     * Opens the dropdown if the focused element is not the toggle icon.
     * @param event The focus event.
     */
    protected onInputFocusIn(event: FocusEvent): void
    {
        if (!event.defaultPrevented && event.target !== this.toggleElement && !this.open)
        {
            this.openDropdown(false);
        }
    }

    /**
     * Called when the input, or an element within the input, looses focus.
     * Ensures the state is reset, even if the dropdown is not visible.
     * @param event The focus event.
     */
    protected onInputFocusOut(event: FocusEvent): void
    {
        if (!event.defaultPrevented && this.open && this.itemPicker.empty)
        {
            this.closeDropdown(false, false);
        }
    }

    /**
     * Called when a `change` event is triggered on the input.
     * Prevents the event from bubbling further, as this input dispatches its own event.
     * @param event The change event.
     */
    protected onInputChange(event: Event): void
    {
        event.stopPropagation();
    }
}
