import { autoinject, bindable, computedFrom, bindingMode } from "aurelia-framework";
import { Id, escapeRegExp } from "shared/utilities";
import { AutocompleteHint, EnterKeyHint } from "../input";
import { NumberFormat } from "shared/localization";

/**
 * Custom element representing a number input.
 */
@autoinject
export class NumberInputCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param numberFormat The `NumberFormat` instance.
     */
    public constructor(numberFormat: NumberFormat)
    {
        this.numberFormat = numberFormat;
    }

    /**
     * The unique ID of the input element associated with the label.
     */
    protected id = Id.sequential();

    /**
     * The number format for the current locale.
     */
    protected numberFormat: NumberFormat;

    /**
     * The input element.
     */
    protected inputElement: HTMLInputElement;

    /**
     * The value entered in the input element, or undefined if the value is valid and the input is not focused.
     */
    protected enteredValue: string | undefined;

    /**
     * True if the entered value should be validated, otherwise false
     */
    protected validate = false;

    /**
     * True if the entered value is invalid, otherwise false.
     */
    protected invalid = false;

    /**
     * Gets the value of the input element based on the value of the component.
     */
    @computedFrom("value")
    protected get inputValue(): string
    {
        // If the user entered a value, return that.
        if (this.enteredValue != null)
        {
            return this.enteredValue;
        }

        // Return the value of the input element.
        return this.value != null ? this.value.toString().replace(".", this.numberFormat.decimalSeparator) : "";
    }

    /**
     * Sets the value of the component based on the value of the input element.
     * Note that the value is only set if the input value can be parsed successfully.
     */
    protected set inputValue(value: string)
    {
        // Store the value entered by the user.
        this.enteredValue = value;

        // Parse the value of the input element.
        if (value)
        {
            // Is the value valid?
            if (this.numberFormat.validPattern.test(value))
            {
                this.value = parseFloat(value) || 0;
                this.invalid = false;
            }
            else
            {
                this.value = undefined;
                this.invalid = true;
            }
        }
        else
        {
            this.value = undefined;
            this.invalid = false;
        }
    }

    /**
     * The value of the input, or undefined if the input is empty or invalid.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public value: number | undefined;

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
     * The hint indicating the type of `Enter` key to show on a virtual keyboard,
     * or undefined to use the default behavior.
     */
    @bindable({ defaultValue: undefined })
    public enterkey: EnterKeyHint | undefined;

    /**
     * The autocomplete mode to use, or undefined to use the default behavior.
     */
    @bindable({ defaultValue: "off" })
    public autocomplete: AutocompleteHint;

    /**
     * True to select the content when the input is focused, otherwise false.
     */
    @bindable({ defaultValue: false })
    public autoselect: boolean;

    /**
     * The amount by which the value should increment or decrement for each step,
     * or undefined to use the default behavior.
     */
    @bindable({ defaultValue: undefined })
    public step: number | undefined;

    /**
     * The min value of the input, or undefined to use no min value.
     */
    @bindable({ defaultValue: undefined })
    public min: number | undefined;

    /**
     * The max value of the input, or undefined to use no max value.
     */
    @bindable({ defaultValue: undefined })
    public max: number | undefined;

    /**
     * True to format the value according to locale rules, otherwise false.
     */
    @bindable({ defaultValue: true })
    public useGrouping: boolean;

    /**
     * Called when the input element receives focus.
     * Selects the content of the input element, if `autoselect` is enabled.
     */
    protected onFocus(): void
    {
        this.validate = this.invalid;

        if (this.autoselect)
        {
            setTimeout(() => this.inputElement.setSelectionRange(0, this.inputElement.value.length));
        }
    }

    /**
     * Called when the input element looses focus.
     * Clears the value entered by the user.
     */
    protected onBlur(): void
    {
        this.validate = true;

        if (!this.invalid)
        {
            this.enteredValue = undefined;
            this.inputElement.value = this.inputValue;
        }
    }

    /**
     * Called when a key is pressed.
     * Prevents the user from entering some invalid values.
     * @returns True to continue, false to prevent default.
     */
    protected onKeyDown(event: KeyboardEvent): boolean
    {
        // Never handle the event if default has been prevented.
        if (event.defaultPrevented)
        {
            return false;
        }

        // Never block special keys or key combinations.
        if (!event.key || event.key.length > 1 || event.metaKey || event.ctrlKey)
        {
            return true;
        }

        const selectionStart = this.inputElement.selectionStart!;
        const selectionEnd = this.inputElement.selectionEnd;
        const inputValue = this.inputElement.value;
        const decimalSeparatorPattern = new RegExp(`\\.|,|${escapeRegExp(this.numberFormat.decimalSeparator)}`);

        // Prevent the user from entering something other than a digit, a minus sign or a decimal separator.
        if (!this.numberFormat.keyPattern.test(event.key) && !decimalSeparatorPattern.test(event.key))
        {
            return false;
        }

        // Prevent the user from entering a minus sign, except at the beginning of the value.
        if (event.key === this.numberFormat.minusSign && selectionStart > 0)
        {
            return false;
        }

        // Prevent the user from entering something other than a minus sign or a non-zero digit before a leading zero.
        if (event.key !== this.numberFormat.minusSign && !(/[1-9]/).test(event.key) && selectionStart === 0 && inputValue.search(/0/) === 0)
        {
            return false;
        }

        // Prevent the user from entering something other than a decimal separator after a leading zero.
        if (!decimalSeparatorPattern.test(event.key) && selectionStart === 1 && inputValue.search(/0/) === 0)
        {
            return false;
        }

        // Prevent the user from entering a decimal separator if the value already contains a decimal separator outside the selection range.
        if (decimalSeparatorPattern.test(event.key) && (
            inputValue.substring(0, selectionStart).search(decimalSeparatorPattern) >= 0 ||
            selectionEnd != null && inputValue.substring(selectionEnd).search(decimalSeparatorPattern) >= 0))
        {
            return false;
        }

        // Prevent the user from entering negative numbers if `min` is more than zero.
        if (this.min != null && this.min >= 0)
        {
            if (event.key === this.numberFormat.minusSign)
            {
                return false;
            }
        }

        // Prevent the user from entering positive numbers if `max` is less than zero.
        if (this.max != null && this.max < 0)
        {
            if (event.key !== this.numberFormat.minusSign && selectionStart === 0)
            {
                return false;
            }
        }

        // Prevent the user from entering a decimal point if `step` is a whole number.
        if (this.step != null && this.step % 1 === 0)
        {
            if (decimalSeparatorPattern.test(event.key))
            {
                return false;
            }
        }

        // Coerce the enterede decimal separator to match the decimal separator for the current locale.
        if (decimalSeparatorPattern.test(event.key))
        {
            document.execCommand("insertText", false, this.numberFormat.decimalSeparator);

            return false;
        }

        return true;
    }
}
