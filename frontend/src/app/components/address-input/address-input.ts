import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { LabelPosition, AutocompleteHint, ItemPickerCustomElement } from "shared/framework";
import { Operation } from "shared/utilities";
import { Address } from "app/model/shared";
import { AddressService } from "./services/address-service/address-service";

/**
 * Custom element representing an input for picking an address.
 */
@autoinject
export class AddressInputCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     * @param addressService The `AddressService` instance.
     */
    public constructor(element: Element, addressService: AddressService)
    {
        this._element = element as HTMLElement;
        this._addressService = addressService;
    }

    private readonly _element: HTMLElement;
    private readonly _addressService: AddressService;

    /**
     * The most recent fetch operation.
     */
    protected fetchOperation: Operation;

    /**
     * The element representing the input.
     */
    protected inputElement: HTMLElement;

    /**
     * The element representing the toggle icon.
     */
    protected toggleElement: HTMLElement;

    /**
     * The value entered by the user, or undefined.
     */
    protected enteredValue: string | undefined;

    /**
     * The view model for the item picker.
     */
    protected itemPicker: ItemPickerCustomElement;

    /**
     * Gets the items that match the entered address.
     */
    protected items: Address[] = [];

    /**
     * Gets the input value.
     */
    @computedFrom("open", "focusedValue", "enteredValue", "value")
    protected get inputValue(): string
    {
        // If the user entered a value, return that.
        if (this.enteredValue != null)
        {
            return this.enteredValue;
        }

        if (this.open)
        {
            // If open with a focused value, format and return that.
            if (this.focusedValue != null)
            {
                return this.focusedValue.toString();
            }
        }
        else
        {
            // If closed with a comitted value, format and return that.
            if (this.value != null)
            {
                return this.value.toString();
            }
        }

        // The input is empty.
        return "";
    }

    /**
     * Sets the input value.
     */
    protected set inputValue(value: string)
    {
        // Store the value entered by the user.
        this.enteredValue = value;

        // Clear the focused value when the input value changes.
        this.focusedValue = undefined;

        try
        {
            // Fetch addresses matching the input value.
            this.fetchItems(value);
        }
        catch (error)
        {
            // TODO: Show an error.
            this.items = [];
        }
    }

    /**
     * The position of the label, or undefined to show no label.
     */
    @bindable({ defaultValue: undefined })
    public label: LabelPosition | undefined;

    /**
     * The address picked by the user, or undefined if no address has been picked.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public value: Address | undefined;

    /**
     * The address that is focused, but not yet picked, or undefined if no address has been focused.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public focusedValue: Address | undefined;

    /**
     * True to show the `None` option, otherwise false.
     */
    @bindable({ defaultValue: true })
    public none: boolean;

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
     * True to use `fixed` positioning for the dropdown, otherwise false.
     * This may be needed if the dropdown is placed within a container that
     * hides overflowing content, but note that it has a performance cost.
     */
    @bindable({ defaultValue: false })
    public fixed: boolean;

    /**
     * Opens the dropdown and optionally focuses the input element.
     * @param focusInput True to focus the input element, otherwise false.
     */
    protected openDropdown(focusInput: boolean): void
    {
        this.open = true;
        this.focusedValue = this.value;

        setTimeout(() => this.itemPicker.scrollToFocusedValue(), 100);

        if (focusInput)
        {
            setTimeout(() => this.inputElement.focus());
        }

        if (this.value != null)
        {
            this.fetchItems(this.value.toString());
        }
    }

    /**
     * Closes the dropdown and optionally focuses the toggle icon.
     * Also reverts the focused value if no value was picked.
     * @param focusToggle True to focus the toggle icon, otherwise false.
     * @param pick True if the user picked a value, otherwise false.
     */
    protected closeDropdown(focusToggle: boolean, pick = false): void
    {
        // Abort any existing operation.
        if (this.fetchOperation != null)
        {
            this.fetchOperation.abort();
        }

        this.open = false;

        if (pick && this.focusedValue !== this.value)
        {
            this.value = this.focusedValue;

            if (this.value !== null)
            {
                this.enteredValue = undefined;
                this.items = [];
            }

            // Dispatch the `input` event to indicate that the comitted value, has changed.
            this._element.dispatchEvent(new CustomEvent("input", { bubbles: true, detail: { value: this.value } }));

            // Dispatch the `change` event to indicate that the comitted value, has changed.
            this._element.dispatchEvent(new CustomEvent("change", { bubbles: true, detail: { value: this.value } }));
        }
        else
        {
            this.focusedValue = this.value;
            this.enteredValue = undefined;
            this.items = [];
        }

        if (focusToggle)
        {
            this.toggleElement.focus();
        }
    }

    /**
     * Called when the toggle icon or the input element is clicked.
     * Toggles the dropdown between its open and closed state, focusing either the input element or toggle icon.
     */
    protected toggleDropdown(): void
    {
        if (this.open)
        {
            this.closeDropdown(true);
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
        if (!event.defaultPrevented && !this.open)
        {
            this.openDropdown(true);
        }

        return true;
    }

    /**
     * Called when a key is pressed within the input element.
     * Prevents the user from entering some invalid values.
     * @param event The keyboard event.
     */
    protected onInputKeyDown(event: KeyboardEvent): boolean
    {
        if (event.defaultPrevented)
        {
            return true;
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
     * Called when the input, or an element within the input, looses focus.
     * Ensures the state is reset, even if the dropdown is not visible.
     * @param event The focus event.
     */
    protected onInputFocusOut(event: FocusEvent): void
    {
        if (!event.defaultPrevented && this.open && !this.inputValue)
        {
            this.closeDropdown(false, true);
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

    /**
     * Called by the framework when the `value` property changes.
     * Ensures the focused value matches the new value.
     */
    protected valueChanged(): void
    {
        this.focusedValue = this.value;
    }

    /**
     * Fetches the items matching the specified query.
     * @param query The query for which items should be fetched.
     */
    private fetchItems(query: string): void
    {
        // Abort any existing operation.
        if (this.fetchOperation != null)
        {
            this.fetchOperation.abort();
        }

        // Create and execute the new operation.
        this.fetchOperation = new Operation(async signal =>
        {
            this.items = await this._addressService.getAddresses(query, signal);
        });
    }
}
