import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { LabelPosition } from "../../control";
import { AutocompleteHint } from "../input";
import { DateTime, Zone } from "luxon";
import { DateFormat } from "shared/localization";
import { Placement } from "popper.js";

/**
 * Custom element representing an input for picking a date.
 */
@autoinject
export class DateInputCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     * @param dateFormat The `DateFormat` instance.
     */
    public constructor(element: Element, dateFormat: DateFormat)
    {
        this._element = element as HTMLElement;
        this.dateFormat = dateFormat;
    }

    private readonly _element: HTMLElement;

    /**
     * The date format for the current locale.
     */
    protected dateFormat: DateFormat;

    /**
     * The element representing the text input.
     */
    protected inputElement: HTMLElement;

    /**
     * The element representing the toggle icon.
     */
    protected toggleElement: HTMLElement;

    /**
     * True if the entered value is valid, otherwise false.
     */
    protected isValid = true;

    /**
     * The value entered by the user, or undefined.
     */
    protected enteredValue: string | undefined;

    /**
     * The placement of the dropdown, relative to its owner.
     */
    @bindable({ defaultValue: "bottom-start" })
    public placement: Placement;

    /**
     * Gets the input value.
     */
    @computedFrom("open", "enteredValue", "focusedValue", "value")
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
                return this.focusedValue.toFormat(this.dateFormat.inputFormat);
            }
        }
        else
        {
            // If closed with a comitted value, format and return that.
            if (this.value != null)
            {
                return this.value.toFormat(this.dateFormat.inputFormat);
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

        if (value)
        {
            // Try to parse the value.
            let date = DateTime.fromFormat(value, this.dateFormat.inputFormat);

            // If enabled, preserve the time of the current value.
            if (this.preserveTime && value != null && this.focusedValue != null)
            {
                date = date.plus(this.focusedValue.diff(this.focusedValue.startOf("day")));
            }

            // Update the focused value.
            this.focusedValue = date.isValid ? date : null;

            // Update the validity.
            this.isValid = date.isValid;
        }
        else
        {
            // The input is empty, so reset the focused value and validity.
            this.focusedValue = undefined;
            this.isValid = true;
        }
    }

    /**
     * The position of the label, or undefined to show no label.
     */
    @bindable({ defaultValue: undefined })
    public label: LabelPosition | undefined;

    /**
     * The IANA Time Zone Identifier to use, `local` to use the local zone, or `utc` to use the UTC zone.
     */
    @bindable({ defaultValue: "local" })
    public zone: string | Zone;

    /**
     * The date picked by the user, null if the entered value could not be parsed,
     * or undefined if no date has been entered or picked.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public value: DateTime | null | undefined;

    /**
     * The date that is focused, but not yet picked, null if the entered value
     * could not be parsed, or undefined if no date has been entered or focused.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public focusedValue: DateTime | null | undefined;

    /**
     * The earliest date that can be selected, or undefined to disable this constraint.
     * This may be a `DateTime` instance, an ISO 8601 string, or the string `today`.
     */
    @bindable({ defaultValue: undefined })
    public min: DateTime | string | "today" | undefined;

    /**
     * The latest date that can be selected, or undefined to disable this constraint.
     * This may be a `DateTime` instance, an ISO 8601 string, or the string `today`.
     */
    @bindable({ defaultValue: undefined })
    public max: DateTime | string | "today" | undefined;

    /**
     * True to preserve the time of the current value when selecting a date,
     * false to always selecting the start of the day.
     */
    @bindable({ defaultValue: true })
    public preserveTime: boolean | undefined;

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
        this.focusedValue = this.isValid ? this.value : null;

        if (focusInput)
        {
            setTimeout(() => this.inputElement.focus());
        }
    }

    /**
     * Closes the dropdown and optionally focuses the toggle icon.
     * Also either sets the focused value as the picked value, or reverts it.
     * @param focusToggle True to focus the toggle icon, otherwise false.
     * @param pick True if the user picked a value, otherwise false.
     */
    protected closeDropdown(focusToggle: boolean, pick = false): void
    {
        this.open = false;

        if (pick)
        {
            const value = this.isValid ? this.focusedValue : null;

            if (value !== this.value)
            {
                this.value = value;

                // Dispatch the `input` event to indicate that the comitted value, has changed.
                this._element.dispatchEvent(new CustomEvent("input", { bubbles: true, detail: { value: this.value } }));

                // Dispatch the `change` event to indicate that the comitted value, has changed.
                this._element.dispatchEvent(new CustomEvent("change", { bubbles: true, detail: { value: this.value } }));
            }
        }
        else
        {
            this.focusedValue = this.isValid ? this.value : null;
            this.enteredValue = undefined;
            this.isValid = true;
        }

        if (focusToggle)
        {
            this.toggleElement.focus();
        }
    }

    /**
     * Called when the toggle icon is clicked, and when the input element is clicked.
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
     * @returns True to continue, false to prevent default.
     */
    protected onInputKeyDown(event: KeyboardEvent): boolean
    {
        if (event.defaultPrevented)
        {
            return true;
        }

        if (!this.isValid && !(event.altKey || event.metaKey || event.shiftKey || event.ctrlKey))
        {
            switch (event.key)
            {
                case "Enter":
                {
                    return false;
                }
            }
        }

        // Never block special keys or key combinations.
        if (!event.key || event.key.length > 1 || event.metaKey || event.ctrlKey)
        {
            return true;
        }

        // Prevent the user from entering characters that are not part of the pattern.
        if (!this.dateFormat.keyPattern.test(event.key))
        {
            return false;
        }

        return true;
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
     */
    protected valueChanged(): void
    {
        // This check is needed to avoid clearing the entered value when parsing fails.
        if (this.value !== null)
        {
            // Clear the entered value when a new value is set.
            this.enteredValue = undefined;

            // We cannot assume the value is valid, as it may come from outside the component.
            this.isValid = this.value == null || this.value.isValid;
        }

        // Set the focused value to match the value.
        this.focusedValue = this.value;
    }

    /**
     * Called by the framework when the `focusedValue` property changes.
     */
    protected focusedValueChanged(): void
    {
        // This check is needed to avoid clearing the entered value when parsing fails.
        if (this.focusedValue !== null)
        {
            // Clear the entered value when a new value is focused.
            this.enteredValue = undefined;

            // We can assume the new focused value is valid, as it comes from within the component.
            this.isValid = true;
        }
    }
}
