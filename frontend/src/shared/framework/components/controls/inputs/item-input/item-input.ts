import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { AutocompleteHint } from "../input";

/**
 * Custom element representing an input for picking a single item.
 */
@autoinject
export class ItemInputCustomElement
{
    /**
     * The element representing the component.
     */
    protected element: HTMLElement;

    /**
     * The element representing the text input.
     */
    protected inputElement: HTMLElement;

    /**
     * Gets the filter input value.
     */
    @computedFrom("open", "allowFiltering", "filterValue", "displayValue", "value")
    protected get inputValue(): string
    {
        if (this.open)
        {
            return (this.allowFiltering && this.filterValue) || "";
        }

        if (this.displayValue != null)
        {
            return this.displayValue.toString();
        }

        if (this.value != null)
        {
            return this.value.toString();
        }

        return "";
    }

    /**
     * Sets the filter input value.
     */
    protected set inputValue(value: string)
    {
        this.filterValue = value || undefined;
    }

    /**
     * The position of the label, or undefined to show no label.
     */
    @bindable({ defaultValue: undefined })
    public label: "above" | "inline" | undefined;

    /**
     * The value of the picked item, or undefined if no item has been picked.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public value: any | undefined;

    /**
     * The value shown in the input, or undefined to use the string representation of the `value`.
     */
    @bindable({ defaultValue: undefined })
    public displayValue: any | undefined;

    /**
     * The value that is currently focused, but not yet selected, or undefined if no value is focused.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public focusedValue: any | undefined;

    /**
     * True to allow filtering by typing into the input, otherwise false.
     */
    @bindable({ defaultValue: true })
    public allowFiltering: boolean;

    /**
     * The value entered in the filter input, or undefined if no value is entered.
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
    public disabled: string;

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
     * Opens the dropdown and optionally focuses the filter input.
     * @param focusInput True to focus the filter input, otherwise false.
     */
    protected openDropdown(focusInput: boolean): void
    {
        this.open = true;
        this.focusedValue = this.value;

        if (focusInput)
        {
            this.inputElement.focus();
        }
    }

    /**
     * Closes the dropdown, clears the filter value and optionally focuses the component.
     * @param focusComponent True to focus the component, otherwise false.
     */
    protected closeDropdown(focusComponent: boolean): void
    {
        this.open = false;
        this.filterValue = undefined;
        this.focusedValue = undefined;

        if (focusComponent)
        {
            this.element.focus();
        }
    }

    /**
     * Called when the chevron is clicked.
     * Toggles the dropdown between its open and closed state,
     * and focuses either the filter input or component.
     * @param event The mouse event.
     */
    protected onChevronMouseDown(event: MouseEvent): void
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
     * Called when the filter input is clicked.
     * Opens the dropdown and focuses the filter input.
     * @param event The mouse event.
     */
    protected onInputMouseDown(event: MouseEvent): void
    {
        if (!event.defaultPrevented)
        {
            this.openDropdown(true);
        }
    }

    /**
     * Called when a key is pressed within the component.
     * Opens the dropdown if the `Enter` key is pressed while the dropdown is closed.
     * @param event The keyboard event.
     * @returns True to continue, false to prevent default.
     */
    protected onKeyDown(event: KeyboardEvent): boolean
    {
        if (!this.open && event.key === "Enter" && !event.defaultPrevented)
        {
            this.openDropdown(true);

            return false;
        }

        return true;
    }
}
