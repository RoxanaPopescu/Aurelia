import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { Id } from "shared/utilities";
import { AutocompleteHint, EnterKeyHint } from "../input";

/**
 * Custom element representing a slug input.
 */
@autoinject
export class SlugInputCustomElement
{
    /**
     * The unique ID of the control.
     */
    protected id = Id.sequential();

    /**
     * The input element.
     */
    protected inputElement: HTMLInputElement | HTMLTextAreaElement;

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
     * The max length of the value, or undefined to use the max supported length.
     */
    @bindable({ defaultValue: undefined })
    public maxlength: number | undefined;

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
     * Trims the value to remove leading and trailing whitespace.
     */
    protected onBlur(): void
    {
        if (this.value)
        {
            this.value = this.value.trim();
        }
    }

    /**
     * Called when a key is pressed.
     * Prevents the user from entering invalid characters.
     */
    protected onKeyDown(event: KeyboardEvent): boolean
    {
        // Never block special keys or key combinations.
        if (event.defaultPrevented || !event.key || event.key.length > 1 || event.metaKey || event.ctrlKey)
        {
            return true;
        }

        return /^[-a-z0-9]$/.test(event.key);
    }
}
