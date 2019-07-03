import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { AutocompleteHint, AutocorrectHint, AutocapitalizeHint, EnterKeyHint } from "../input";

/**
 * Custom element representing a text input.
 */
@autoinject
export class TextInputCustomElement
{
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
    public disabled: string;

    /**
     * True if the input is readonly, otherwise false.
     */
    @bindable({ defaultValue: false })
    public readonly: boolean;

    /**
     * The autocomplete mode to use.
     * The default is `off`.
     */
    @bindable({ defaultValue: "off" })
    public autocomplete: AutocompleteHint;

    /**
     * The autocomplete mode to use.
     * The default is `off`.
     */
    @bindable({ defaultValue: "off" })
    public autocorrect: AutocorrectHint;

    /**
     * True to enable autocomplete.
     * The default is `sentence`.
     */
    @bindable({ defaultValue: "sentence" })
    public autocapitalize: AutocapitalizeHint;

    /**
     * True to select the contents when the input is focused, otherwise false.
     */
    @bindable({ defaultValue: false })
    public autoselect: boolean;

    /**
     * The initial number of text lines in the input,
     * or undefined to allow only a single line.
     */
    @bindable({ defaultValue: undefined })
    public lines: number | undefined;

    /**
     * The min length of the value.
     */
    @bindable({ defaultValue: 0 })
    public minLength: number;

    /**
     * The max length of the value.
     */
    @bindable({ defaultValue: 100 })
    public maxLength: number;

    /**
     * True to remove leading and trailing whitespace, otherwise false.
     */
    @bindable({ defaultValue: true })
    public trim: boolean;

    /**
     * The hint indicating the type of `Enter` key to show on a virtual keyboard
     * for a single-line text input, or undefined to use the default behavior.
     */
    @bindable({ defaultValue: undefined })
    public enterkey: EnterKeyHint | undefined;

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
