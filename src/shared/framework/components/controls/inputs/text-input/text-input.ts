import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { Id } from "shared/utilities";
import { AutocompleteHint, AutocorrectHint, AutocapitalizeHint, EnterKeyHint, SpellcheckHint, InputMode } from "../input";

/**
 * Custom element representing a text input.
 */
@autoinject
export class TextInputCustomElement
{
    /**
     * The unique ID of the input element associated with the label.
     */
    protected id = Id.sequential();

    /**
     * The input element.
     */
    protected inputElement: HTMLInputElement | HTMLTextAreaElement;

    /**
     * Gets the value of the input element based on the value of the component.
     */
    @computedFrom("value")
    protected get inputValue(): string
    {
        return this.value || "";
    }

    /**
     * Sets the value of the component based on the value of the input element.
     */
    protected set inputValue(value: string)
    {
        this.value = value || undefined;
    }

    /**
     * Gets the value of the autosize element that determines the min height.
     */
    @computedFrom("lines")
    protected get autosizeValue(): string
    {
        return this.lines ? "\n".repeat(this.lines - 1) : "";
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
     * The type of virtual keyboard to use.
     */
    @bindable({ defaultValue: "text" })
    public inputmode: InputMode;

    /**
     * The autocomplete mode to use.
     */
    @bindable({ defaultValue: "off" })
    public autocomplete: AutocompleteHint;

    /**
     * The autocorrect mode to use.
     */
    @bindable({ defaultValue: "off" })
    public autocorrect: AutocorrectHint;

    /**
     * The autocapitalize mode to use.
     */
    @bindable({ defaultValue: "sentence" })
    public autocapitalize: AutocapitalizeHint;

    /**
     * True to select the contents when the input is focused, otherwise false.
     */
    @bindable({ defaultValue: false })
    public autoselect: boolean;

    /**
     * The spellcheck mode to use.
     */
    @bindable({ defaultValue: "multiline" })
    public spellcheck: SpellcheckHint;

    /**
     * The hint indicating the type of `Enter` key to show on a virtual keyboard
     * for a single-line text input, or undefined to use the default behavior.
     */
    @bindable({ defaultValue: undefined })
    public enterkey: EnterKeyHint | undefined;

    /**
     * The initial number of text lines in the input, or undefined to allow only a single line.
     */
    @bindable({ defaultValue: undefined })
    public lines: number | undefined;

    /**
     * True to allow the input to grow to fit the content, otherwise false.
     */
    @bindable({ defaultValue: false })
    public autosize: boolean;

    /**
     * The max length of the value, or undefined to use the max supported length.
     */
    @bindable({ defaultValue: undefined })
    public maxlength: number | undefined;

    /**
     * True to remove leading and trailing whitespace, otherwise false.
     */
    @bindable({ defaultValue: true })
    public trim: boolean;

    /**
     * Called when the input receives focus.
     * Selects the contents of the input, if `autoselect` is enabled, or if the input contains
     * line breaks, ensures the cursor is positioned at the beginning of the text.
     */
    protected onFocus(): void
    {
        if (this.autoselect)
        {
            setTimeout(() => this.inputElement.setSelectionRange(0, this.inputElement.value.length), 50);
        }
        else if (this.value && this.value.includes("\n"))
        {
            this.inputElement.setSelectionRange(0, 0);
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
