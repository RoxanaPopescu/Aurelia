import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { Id } from "shared/utilities";
import { EnterKeyHint } from "../input";

/**
 * Custom element representing a password input.
 */
@autoinject
export class PasswordInputCustomElement
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
     * Gets the input value.
     */
    @computedFrom("value")
    protected get inputValue(): string
    {
        return this.value != null ? this.value : "";
    }

    /**
     * Sets the input value.
     */
    protected set inputValue(value: string)
    {
        this.value = value || undefined;
    }

    /**
     * The value of the input, or undefined if the input is empty.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public value: string | undefined;

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
     * The autocomplete mode to use.
     */
    @bindable({ defaultValue: "off" })
    public autocomplete: "on" | "off" | "new-password" | "current-password";

    /**
     * True to select the contents when the input is focused, otherwise false.
     */
    @bindable({ defaultValue: false })
    public autoselect: boolean;

    /**
     * The hint indicating the type of `Enter` key to show on a virtual keyboard
     * for a single-line text input, or undefined to use the default behavior.
     */
    @bindable({ defaultValue: "search" })
    public enterkey: EnterKeyHint | undefined;

    /**
     * The max length of the value, or undefined to use the max supported length.
     */
    @bindable({ defaultValue: undefined })
    public maxlength: number | undefined;

    /**
     * True to remove leading and trailing whitespace, otherwise false.
     */
    @bindable({ defaultValue: false })
    public trim: boolean;

    /**
     * Called when the input receives focus.
     * Selects the contents of the input, if `autoselect` is enabled.
     */
    protected onFocus(): void
    {
        if (this.autoselect)
        {
            setTimeout(() => this.inputElement.setSelectionRange(0, this.inputElement.value.length), 50);
        }
    }

    /**
     * Called when the input looses focus.
     * If enabled, trims the value to remove leading and trailing whitespace.
     */
    protected onBlur(): void
    {
        if (this.trim && this.value)
        {
            this.value = this.value.trim();
        }
    }
}
