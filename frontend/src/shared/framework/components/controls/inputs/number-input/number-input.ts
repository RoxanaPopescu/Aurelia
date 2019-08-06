import { autoinject, bindable, computedFrom, bindingMode } from "aurelia-framework";
import { AutocompleteHint, EnterKeyHint } from "../input";

/**
 * Custom element representing a number input.
 */
@autoinject
export class NumberInputCustomElement
{
    /**
     * The input element.
     */
    protected inputElement: HTMLInputElement;

    /**
     * Gets the input value.
     */
    @computedFrom("value")
    protected get inputValue(): string
    {
        return this.value != null ? this.value.toString() : "";
    }

    /**
     * Sets the input value.
     */
    protected set inputValue(value: string)
    {
        if (value === "")
        {
            this.value = undefined;
        }

        const number = Number.parseFloat(value);

        if (!Number.isNaN(number))
        {
            this.value = number;
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
     * The hint indicating the type of `Enter` key to show on a virtual keyboard,
     * or undefined to use the default behavior.
     */
    @bindable({ defaultValue: undefined })
    public enterkey: EnterKeyHint | undefined;

    /**
     * The max number of digits to allow, or undefined to apply no limit.
     */
    @bindable({ defaultValue: undefined })
    public maxdigits: number;

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
     * True to constrain keyboard input to enforce the specified `min`, `max`, `step` and `maxdigits`.
     * Note that this does not prevent an invalid value from being pasted into the input.
     */
    @bindable({ defaultValue: false })
    public constrain: boolean;

    /**
     * Called when the input receives focus.
     * Selects the contents of the input, if `autoselect` is enabled.
     */
    protected onFocus(): void
    {
        if (this.autoselect)
        {
            setTimeout(() => this.inputElement.setSelectionRange(0, this.inputElement.value.length));
        }
    }

    /**
     * Called when the input looses focus.
     * Reassigns the input value, to remove any trailing decimal separators.
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
     */
    protected onKeyDown(event: KeyboardEvent): boolean
    {
        // Prevent the user from entering '+'.
        if (event.key === "+")
        {
            return false;
        }

        // Prevent the user from entering '-', except at the beginning of the value.
        if (event.key === "-" && this.inputElement.selectionStart! > 0)
        {
            return false;
        }

        // Prevent the user from entering something other than a digit or '-' at the beginning of the value.
        if (/\d-/.test(event.key) && this.inputElement.selectionStart === 0)
        {
            return false;
        }

        // Prevent the user from entering consecutive zeros at the beginning of the value.
        if (event.key === "0" && this.inputElement.selectionStart! <= this.inputElement.value.search(/[^+-0]/))
        {
            return false;
        }

        if (this.constrain)
        {
            // Prevent the user from entering negative numbers if `min` is larger than zero.
            if (event.key === "-" && this.min != null && this.min >= 0)
            {
                return false;
            }

            // Prevent the user from entering positive numbers if `max` is less than than zero.
            if (event.key !== "-" && this.max != null && this.max < 0 && this.inputElement.selectionStart === 0)
            {
                return false;
            }

            // Prevent the user from entering a decimal point if `step` is a whole number.
            if (this.step % 1 === 0 && !/\d-/.test(event.key))
            {
                return false;
            }

            // Prevent the user from entering numbers with more digits than `maxdigits`.
            if (this.inputElement.value.replace(/[^0-9]/g, "").length > this.maxdigits)
            {
                return false;
            }
        }

        return true;
    }
}
