import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { Placement } from "popper.js";
import { ItemPickerCustomElement } from "../../pickers/item-picker/item-picker";
import { AccentColor } from "resources/styles";

/**
 * Custom element representing an button for picking a single item from a list.
 */
@autoinject
export class SelectButtonCustomElement
{
    /**
     * The element representing the button.
     */
    protected buttonElement: HTMLElement;

    /**
     * The view model for the item picker.
     */
    protected itemPicker: ItemPickerCustomElement;

    /**
     * The value of the item picked by the user, or undefined if no item has been picked.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.toView })
    public value: any | undefined;

    /**
     * The value of the item that is focused, but not yet picked, or undefined if no item has been focused.
     */
    @bindable({ defaultValue: null, defaultBindingMode: bindingMode.twoWay })
    public focusedValue: any | undefined;

    /**
     * True to show the `None` option, otherwise false.
     */
    @bindable({ defaultValue: false })
    public none: boolean;

    /**
     * True if the dropdown is open, otherwise false.
     */
    @bindable({ defaultValue: false, defaultBindingMode: bindingMode.fromView })
    public open: boolean;

    /**
     * True if the button is disabled, otherwise false.
     */
    @bindable({ defaultValue: false })
    public disabled: boolean;

    /**
     * The appearance to use for the button.
     */
    @bindable({ defaultValue: "none" })
    public appearance: "none" | "text" | "outline" | "solid";

    /**
     * The accent color to use for the button, or undefined to use the default.
     */
    @bindable({ defaultValue: undefined })
    public accent: AccentColor;

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
     * Opens the dropdown and optionally focuses the button element.
     * @param focusButton True to focus the button element, otherwise false.
     */
    protected openDropdown(focusButton: boolean): void
    {
        this.open = true;
        this.focusedValue = this.value;

        setTimeout(() => this.itemPicker?.scrollToFocusedValue());

        if (focusButton)
        {
            setTimeout(() => this.buttonElement.focus());
        }
    }

    /**
     * Closes the dropdown, clears the filter value and optionally focuses the toggle icon.
     * Also reverts the focused value if no value was picked.
     * @param focusToggle True to focus the toggle icon, otherwise false.
     */
    protected closeDropdown(focusToggle: boolean): void
    {
        this.open = false;
        this.focusedValue = null;

        if (focusToggle)
        {
            this.buttonElement.focus();
        }
    }

    /**
     * Called when the toggle icon is clicked, and if filtering is disabled, when the button element is clicked.
     * Toggles the dropdown between its open and closed state, focusing either the button element or toggle icon.
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
}
