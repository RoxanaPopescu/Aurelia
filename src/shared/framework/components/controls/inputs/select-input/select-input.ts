import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { Placement } from "popper.js";
import { LabelPosition, shouldFocusInput } from "../../control";
import { AutocompleteHint, EnterKeyHint } from "../input";
import { ItemPickerCustomElement } from "../../pickers/item-picker/item-picker";

/**
 * Custom element representing an input for picking a single item from a list.
 */
@autoinject
export class SelectInputCustomElement
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
    @computedFrom("open", "filter", "filterValue", "displayValue", "value")
    protected get inputValue(): string
    {
        if (this.open)
        {
            if (this.filter !== "off" && this.filterValue != null)
            {
                return this.filterValue;
            }
        }
        else
        {
            if (this.displayValue != null)
            {
                return this.displayValue.toString();
            }

            if (this.value != null)
            {
                return this.value.toString();
            }
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
    }

    /**
     * The position of the label, or undefined to show no label.
     */
    @bindable({ defaultValue: undefined })
    public label: LabelPosition | undefined;

    /**
     * The value of the item picked by the user, or undefined if no item has been picked.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public value: any | undefined;

    /**
     * The value of the item that is focused, but not yet picked, or undefined if no item has been focused.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public focusedValue: any | undefined;

    /**
     * The value to shown in the input, or undefined to use the string representation of the `value`.
     */
    @bindable({ defaultValue: undefined })
    public displayValue: any | undefined;

    /**
     * True to show the `None` option, otherwise false.
     */
    @bindable({ defaultValue: true })
    public none: boolean;

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
     * Opens the dropdown and optionally focuses the input element.
     * @param focusInput True to focus the input element, otherwise false.
     */
    protected openDropdown(focusInput: boolean): void
    {
        this.open = true;
        this.focusedValue = this.value;

        setTimeout(() => this.itemPicker?.scrollToFocusedValue());

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
     */
    protected closeDropdown(focusToggle: boolean, pick = false): void
    {
        this.open = false;
        this.filterValue = undefined;

        if (pick && this.focusedValue !== this.value)
        {
            this.value = this.focusedValue;

            // Dispatch the `input` event to indicate that the comitted value, has changed.
            this._element.dispatchEvent(new CustomEvent("input", { bubbles: true, detail: { value: this.value } }));

            // Dispatch the `change` event to indicate that the comitted value, has changed.
            this._element.dispatchEvent(new CustomEvent("change", { bubbles: true, detail: { value: this.value } }));
        }
        else
        {
            this.focusedValue = this.value;
        }

        if (focusToggle)
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
     * Called when the input element is clicked.
     * Opens the dropdown and focuses the input element.
     * @param event The mouse event.
     * @returns True to continue.
     */
    protected onInputMouseDown(event: MouseEvent): boolean
    {
        if (!event.defaultPrevented)
        {
            if (!this.open)
            {
                this.openDropdown(true);
            }
            else if (this.filter === "off")
            {
                this.closeDropdown(false);
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
     * Called when the input, or an element within the input, receives focus.
     * Opens the dropdown if the focused element is not the toggle icon.
     * @param event The focus event.
     */
    protected onInputFocusIn(event: FocusEvent): void
    {
        if (event.target !== this.toggleElement && !this.open)
        {
            this.openDropdown(false);
        }
    }

    /**
     * Called when an event is triggered.
     * Prevents the event from bubbling further, as this input dispatches its own event.
     * @param event The event.
     */
    protected onInternalEvent(event: Event): void
    {
        event.stopPropagation();
    }

    /**
     * Called by the framework when the `value` property changes.
     * Ensures the focused value matches the new value.
     */
    protected valueChanged(): void
    {
        this.focusedValue = this.value;
    }
}
