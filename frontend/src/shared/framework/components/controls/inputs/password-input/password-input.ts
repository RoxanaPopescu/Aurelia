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
     * True if the password is revealed, otherwise false.
     */
    @bindable({ defaultValue: false })
    public reveal: boolean;

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
     * Ensures the password is hidden.
     */
    protected onBlur(): void
    {
        this.reveal = false;
    }

    /**
     * Called when a `mousedown` event occurs on the `Reveal password` icon.
     * @returns False to prevent default.
     */
    protected onToggleRevealMouseDown(): boolean
    {
        this.reveal = !this.reveal;
        this.inputElement.focus();

        return false;
    }

    /**
     * Called when a `click` event occurs on the `Reveal password` icon.
     * @returns False to prevent default.
     */
    protected onToggleRevealClick(): boolean
    {
        // Needed to prevent form submission, if the input is used within a form.
        return false;
    }

    /**
     * Called when a `keydown` event occurs on the `Reveal password` icon.
     * @param event The keyboard event.
     * @returns True to continue, false to prevent default.
     */
    protected onToggleRevealKeyDown(event: KeyboardEvent): boolean
    {
        if (event.defaultPrevented || event.altKey || event.metaKey || event.shiftKey || event.ctrlKey)
        {
            return true;
        }

        if (event.key === "Enter")
        {
            this.reveal = !this.reveal;
            this.inputElement.focus();

            return false;
        }

        return true;
    }
}
