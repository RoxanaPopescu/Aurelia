import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { LabelPosition } from "../../control";
import { AutocompleteHint } from "../input";

/**
 * Custom element representing an input for picking a single item from a list.
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
     * Gets the input value.
     */
    @computedFrom("open", "filter", "filterValue")
    protected get inputValue(): string
    {
        if (this.filter !== "none" && this.filterValue != null)
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
    public value: any[] = [];

    /**
     * The value of the item that is focused, but not yet picked, or undefined if no item has been focused.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public focusedValue: any | undefined;

    /**
     * The type of filtering to use, where `none` means no filtering, `auto` means filtering based on
     * the text presented in the items, and `custom` means that the input element is enabled, but the
     * actual filtering the items is an external concern.
     */
    @bindable({ defaultValue: "none" })
    public filter: "none" | "auto" | "custom";

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
     * Opens the dropdown and optionally focuses the input element.
     * @param focusInput True to focus the input element, otherwise false.
     */
    protected openDropdown(focusInput: boolean): void
    {
        this.open = true;
        this.focusedValue = undefined;

        if (focusInput)
        {
            setTimeout(() => this.inputElement.focus());
        }
    }

    /**
     * Closes the dropdown, clears the filter value and optionally focuses the toggle icon.
     * @param focusToggle True to focus the toggle icon, otherwise false.
     */
    /**
     * Closes the dropdown, clears the filter value and optionally focuses the toggle icon.
     * Also reverts the focused value if no value was picked.
     * @param focusToggle True to focus the toggle icon, otherwise false.
     * @param pick True if the user picked a value, otherwise false.
     */
    protected closeDropdown(focusToggle: boolean, pick = false): void
    {
        // Click outside or escape.
        if (!focusToggle || !pick)
        {
            this.open = false;
        }

        this.filterValue = undefined;

        if (pick && this.focusedValue)
        {
            this.value.push(this.focusedValue);

            // Dispatch the `change` event to indicate that the comitted value, has changed.
            this._element.dispatchEvent(new CustomEvent("change", { bubbles: true, detail: { value: this.value } }));
        }

        this.focusedValue = undefined;

        if (focusToggle && !pick)
        {
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
            this.closeDropdown(true);
        }
        else
        {
            this.openDropdown(true);
        }
    }

    /**
     * Called when a key is pressed within the input element.
     * Deletes the last tag when `Backspace` is pressed while the input is empty.
     * @param event The mouse event.
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
                    if (this.open && !this.filterValue && this.value.length > 0)
                    {
                        this.open = false;

                        return false;
                    }

                    if (!this.open)
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
                setTimeout(() => this.inputElement.focus());
            }
            else
            {
                if (this.filter !== "none" && !this.open)
                {
                    this.openDropdown(true);
                }
                else
                {
                    this.toggleDropdown();
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
     * Called when the input, or an element within the input, receives focus.
     * Opens the dropdown if the focused element is not the toggle icon.
     * @param event The mouse event.
     */
    protected onInputFocusIn(event: FocusEvent): void
    {
        if (event.target !== this.toggleElement && event.target !== this.toggleElement && !this.open)
        {
            this.openDropdown(false);
        }
    }

    /**
     * Called when a `change` event is triggered on the input.
     * Prevents the event from bubbling further, as the date input dispatches its own event.
     * @param event The mouse event.
     */
    protected onInputChange(event: Event): void
    {
        event.stopPropagation();
    }
}
