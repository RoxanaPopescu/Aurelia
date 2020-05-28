import { autoinject, bindable, computedFrom, bindingMode } from "aurelia-framework";
import { Id } from "shared/utilities";
import { AutocompleteHint, EnterKeyHint } from "../input";
import { IPhoneNumber } from "shared/types";
import { PhoneValueConverter } from "shared/localization";

// tslint:disable-next-line: no-submodule-imports
import { parsePhoneNumber, ParseError } from "libphonenumber-js/min";

/**
 * Custom element representing a phone number input.
 */
@autoinject
export class PhoneInputCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param phoneValueConverter The `PhoneValueConverter` instance.
     */
    public constructor(phoneValueConverter: PhoneValueConverter)
    {
        this._phoneValueConverter = phoneValueConverter;
    }

    private readonly _phoneValueConverter: PhoneValueConverter;

    /**
     * The unique ID of the input element associated with the label.
     */
    protected id = Id.sequential();

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
     * The reason the entered value is invalid, or undefined if unknown or not invalid.
     */
    protected invalidReason: "INVALID_COUNTRY" | "NOT_A_NUMBER" | "TOO_LONG" | "TOO_SHORT" | undefined;

    /**
     * Gets the value of the input element based on the value of the component.
     */
    @computedFrom("enteredValue", "value")
    protected get inputValue(): string
    {
        // If the user entered a value, return that.
        if (this.enteredValue != null)
        {
            return this.enteredValue;
        }

        // Return the value of the input element.
        return this.value ? this._phoneValueConverter.toView(this.value) as string : "";
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
            try
            {
                const phoneNumber = parsePhoneNumber(value);

                if (phoneNumber.isPossible())
                {
                    this.value =
                    {
                        countryCode: phoneNumber.country,
                        countryCallingCode: phoneNumber.countryCallingCode as string,
                        nationalNumber: phoneNumber.nationalNumber as string
                    };

                    this.invalid = false;
                }
                else
                {
                    this.value = undefined;
                    this.invalid = true;
                }
            }
            catch (error)
            {
                this.invalidReason = error instanceof ParseError ? error.message as any : undefined;

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
    public value: IPhoneNumber | undefined;

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
        const inputValue = this.inputElement.value;

        // Prevent the user from entering something other than a digit or a plus sign.
        if (!/\d|\+/.test(event.key))
        {
            return false;
        }

        // Prevent the user from entering a plus sign, except at the beginning of the numeric value.
        if (event.key === "+" && (selectionStart > 0 || inputValue.includes("+")))
        {
            return false;
        }

        return true;
    }
}
