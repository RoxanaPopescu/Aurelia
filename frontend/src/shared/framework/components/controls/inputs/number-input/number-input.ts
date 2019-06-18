import { autoinject, bindable, computedFrom, bindingMode } from "aurelia-framework";
import { AutocompleteHint } from "../input";

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
     * The placeholder text to show when the input is empty,
     * or undefined to show no placeholder.
     */
    @bindable({ defaultValue: undefined })
    public placeholder: string | undefined;

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
}
