import { autoinject, bindable, computedFrom, bindingMode } from "aurelia-framework";
import { Id } from "shared/utilities";
import { AutocompleteHint, EnterKeyHint } from "../input";

/**
 * Custom element representing a number input.
 */
@autoinject
export class NumberInputCustomElement
{
    /**
     * The unique ID of the control.
     */
    protected id = Id.sequential();

    /**
     * The input element.
     */
    protected inputElement: HTMLInputElement;

    /**
     * Gets the input value, based on the value.
     */
    @computedFrom("value")
    protected get inputValue(): string
    {
        return this.value != null ? this.value.toString() : "";
    }

    /**
     * Sets the value, based on the input value.
     * Note that the value is only set if the input value can be parsed successfully.
     */
    protected set inputValue(value: string)
    {
        if (value)
        {
            const number = parseFloat(value);

            if (!isNaN(number))
            {
                this.value = number;
            }
        }
        else
        {
            this.value = undefined;
        }
    }

    /**
     * The value of the input, or undefined if the input is empty.
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
     * The hint indicating the type of `Enter` key to show on a virtual keyboard,
     * or undefined to use the default behavior.
     */
    @bindable({ defaultValue: undefined })
    public enterkey: EnterKeyHint | undefined;

    /**
     * The amount by which the value should increment or decrement for each step.
     */
    @bindable({ defaultValue: 1 })
    public step: number;

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
     * True to constrain keyboard input to enforce the specified `min`, `max` and `step`.
     * Note that this does not prevent an invalid value from being pasted into the input.
     */
    @bindable({ defaultValue: false })
    public constrain: boolean;

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
        if (this.autoselect)
        {
            setTimeout(() => this.inputElement.setSelectionRange(0, this.inputElement.value.length));
        }
    }

    /**
     * Called when the input element looses focus.
     * Sets the value of the input element, to remove any trailing decimal separators.
     */
    protected onBlur(): void
    {
        if (this.inputValue)
        {
            this.inputElement.value = "";
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
        // Never block special keys or key combinations.
        if (!event.key || event.key.length > 1 || event.metaKey || event.ctrlKey)
        {
            return true;
        }

        // Prevent the user from entering '+'.
        if (event.key === "+")
        {
            return false;
        }

        /* TODO: Disabled because selectionStart is not supported on a number input.

        // Prevent the user from entering '-', except at the beginning of the value.
        if (event.key === "-" && this.inputElement.selectionStart! > 0)
        {
            return false;
        }

        // Prevent the user from entering something other than a digit or '-' at the beginning of the value.
        if (!/\d|-/.test(event.key) && this.inputElement.selectionStart === 0)
        {
            return false;
        }

        // Prevent the user from entering consecutive zeros at the beginning of the value.
        if (event.key === "0" && this.inputElement.selectionStart! <= this.inputElement.value.search(/[^+-0]/))
        {
            return false;
        }

        // Prevent the user from entering something other than a decimal separator if the value begins with a zero.
        if (!/\d/.test(event.key) && this.inputElement.selectionStart! === 1 && this.inputElement.value.startsWith("0"))
        {
            return false;
        }

        */

        if (this.constrain)
        {
            // Prevent the user from entering negative numbers if `min` is more than zero.
            if (event.key === "-" && this.min != null && this.min >= 0)
            {
                return false;
            }

            /* TODO: Disabled because selectionStart is not supported on a number input.

            // Prevent the user from entering positive numbers if `max` is less than zero.
            if (event.key !== "-" && this.max != null && this.max < 0 && this.inputElement.selectionStart === 0)
            {
                return false;
            }

            */

            // Prevent the user from entering a decimal point if `step` is a whole number.
            if (this.step % 1 === 0 && !/\d|-/.test(event.key))
            {
                return false;
            }
        }

        return true;
    }
}
