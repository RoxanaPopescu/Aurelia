import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { Duration, DateTime, Zone } from "luxon";
import { TimeValueConverter, TimeFormat } from "shared/localization";
import { LabelPosition, shouldFocusInput } from "../../control";
import { AutocompleteHint, EnterKeyHint } from "../input";
import { ItemPickerCustomElement } from "../../pickers/item-picker/item-picker";

// The items to choose from in the dropdown.
const timeItems: Duration[] = [];

for (let hour = 0; hour < 24; hour++)
{
    for (let minute = 0; minute < 60; minute += 15)
    {
        timeItems.push(Duration.fromObject({ hour, minute }));
    }
}

timeItems.push(Duration.fromObject({ hour: 23, minutes: 59, seconds: 59 }));

/**
 * Custom element representing an input for picking a single item from a list.
 */
@autoinject
export class TimeInputCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     * @param timeFormat The `TimeFormat` instance.
     * @param timeValueConverter The `TimeValueConverter` instance.
     */
    public constructor(element: Element, timeFormat: TimeFormat, timeValueConverter: TimeValueConverter)
    {
        this._element = element as HTMLElement;
        this.timeFormat = timeFormat;
        this._timeValueConverter = timeValueConverter;
    }

    private readonly _element: HTMLElement;
    private readonly _timeValueConverter: TimeValueConverter;
    private _nowIntervalHandle: any;
    private _now: DateTime;

    /**
     * The format info for the current locale.
     */
    protected timeFormat: TimeFormat;

    /**
     * The element representing the input.
     */
    protected inputElement: HTMLElement;

    /**
     * The element representing the toggle icon.
     */
    protected toggleElement: HTMLElement;

    /**
     * The items to show in the dropdown.
     */
    protected items = timeItems;

    /**
     * True if the entered value is valid, otherwise false.
     */
    protected isValid = true;

    /**
     * The value entered by the user, or undefined.
     */
    protected enteredValue: string | undefined;

    /**
     * The view model for the item picker.
     */
    protected itemPicker: ItemPickerCustomElement;

    /**
     * Gets the items that satisfy the min and max constraints.
     */
    @computedFrom("items", "computedMin", "computedMax")
    protected get filteredItems(): Duration[]
    {
        return this.items.filter(item => item == null ||
        (
            (this.computedMin == null || (this.minInclusive ? item.valueOf() >= this.computedMin.valueOf() : item.valueOf() > this.computedMin.valueOf())) &&
            (this.computedMax == null || (this.minInclusive ? item.valueOf() <= this.computedMax.valueOf() : item.valueOf() < this.computedMax.valueOf()))
        ));
    }

    /**
     * Gets the input value.
     */
    @computedFrom("open", "enteredValue", "focusedValue", "value")
    protected get inputValue(): string
    {
        // If the user entered a value, return that.
        if (this.enteredValue != null)
        {
            return this.enteredValue;
        }

        if (this.open)
        {
            // If open with a focused value, format and return that.
            if (this.focusedValue != null)
            {
                return this._timeValueConverter.toView(this.focusedValue)!;
            }
        }
        else
        {
            // If closed with a comitted value, format and return that.
            if (this.value != null)
            {
                return this._timeValueConverter.toView(this.value)!;
            }
        }

        // The input is empty.
        return "";
    }

    /**
     * Sets the input value.
     */
    protected set inputValue(value: string)
    {
        // Store the value entered by the user.
        this.enteredValue = value;

        if (value)
        {
            // Try to parse the value.
            try
            {
                if (!this.timeFormat.inputPattern.test(value) || value.length !== 5)
                {
                    throw new Error("Invalid time of day.");
                }

                const [hour = 0, minute = 0] = value.split(/[^\d]+/, 2).map(s => s ? parseInt(s) : 0);

                if (isNaN(hour) || hour < 0 || hour > 23 || isNaN(minute) || minute < 0 || minute > 59)
                {
                    throw new Error("Invalid time of day.");
                }

                let duration = Duration.fromObject({ hour, minute });

                // If the input value is an exact match for one of the items, use the item.
                // This is needed to ensure the item is highlighted in the item-picker.
                duration = timeItems.find(d => d.valueOf() === duration.valueOf()) || duration;

                // Update the focused value.
                this.focusedValue = duration;

                // Update the validity.
                this.isValid = true;
            }
            catch (error)
            {
                // Update the focused value.
                this.focusedValue = null;

                // Update the validity.
                this.isValid = false;
            }
        }
        else
        {
            // The input is empty, so reset the focused value and validity.
            this.focusedValue = undefined;
            this.isValid = true;
        }
    }

    /**
     * The computed min value.
     */
    @computedFrom("min", "zone", "_now")
    protected get computedMin(): Duration | undefined
    {
        if (this.min === "now")
        {
            return this._now.diff(this._now.startOf("day"));
        }

        if (typeof this.min === "string")
        {
            if (this.min.startsWith("P"))
            {
                return Duration.fromISO(this.min);
            }

            const [hour, minute, second, millisecond] = this.min.split(/:|\./g).map(s => parseInt(s));

            return Duration.fromObject({ hour, minute, second, millisecond });
        }

        return this.min;
    }

    /**
     * The computed max value.
     */
    @computedFrom("max", "zone", "_now")
    protected get computedMax(): Duration | undefined
    {
        if (this.max === "now")
        {
            return this._now.diff(this._now.startOf("day"));
        }

        if (typeof this.max === "string")
        {
            if (this.max.startsWith("P"))
            {
                return Duration.fromISO(this.max);
            }

            const [hour, minute, second, millisecond] = this.max.split(/:|\./g).map(s => parseInt(s));

            return Duration.fromObject({ hour, minute, second, millisecond });
        }

        return this.max;
    }

    /**
     * The position of the label, or undefined to show no label.
     */
    @bindable({ defaultValue: undefined })
    public label: LabelPosition | undefined;

    /**
     * The IANA Time Zone Identifier to use, `local` to use the local zone, or `utc` to use the UTC zone.
     */
    @bindable({ defaultValue: "local" })
    public zone: string | Zone;

    /**
     * The time picked by the user, null if the entered value could not be parsed,
     * or undefined if no time has been entered or picked.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public value: Duration | null | undefined;

    /**
     * The time that is focused, but not yet picked, null if the entered value
     * could not be parsed, or undefined if no time has been entered or focused.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public focusedValue: Duration | null | undefined;

    /**
     * The earliest time that can be selected, or undefined to disable this constraint.
     * This may be an ISO 8601 string, the string `now`, or a `Duration` instance.
     */
    @bindable({ defaultValue: undefined })
    public min: string | Duration | "now" | undefined;

    /**
     * The latest time that can be selected, or undefined to disable this constraint.
     * This may be an ISO 8601 string, the string `now`, or a `Duration` instance.
     */
    @bindable({ defaultValue: undefined })
    public max: string | Duration | "now" | undefined;

    /**
     * True to include the min value as a valid value, otherwise false.
     */
    @bindable({ defaultValue: true })
    public minInclusive: boolean | undefined;

    /**
     * True to include the max value as a valid value, otherwise false.
     */
    @bindable({ defaultValue: true })
    public maxInclusive: boolean | undefined;

    /**
     * True to show the `None` option, otherwise false.
     */
    @bindable({ defaultValue: true })
    public none: boolean;

    /**
     * True if the dropdown is open, otherwise false.
     */
    @bindable({ defaultValue: false, defaultBindingMode: bindingMode.fromView })
    public open: boolean;

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
     * True to use `fixed` positioning for the dropdown, otherwise false.
     * This may be needed if the dropdown is placed within a container that
     * hides overflowing content, but note that it has a performance cost.
     */
    @bindable({ defaultValue: false })
    public fixed: boolean;

    /**
     * Called by the framework when the component is binding.
     */
    public bind(): void
    {
        this._now = DateTime.local().setZone(this.zone);
        this.scheduleNowRefresh();
    }

    /**
     * Called by the framework when the component is unbinding.
     */
    public unbind(): void
    {
        // Stop refreshing the `now` value.
        clearInterval(this._nowIntervalHandle);
    }

    /**
     * Opens the dropdown and optionally focuses the input element.
     * @param focusInput True to focus the input element, otherwise false.
     */
    protected openDropdown(focusInput: boolean): void
    {
        this.open = true;
        this.focusedValue = this.value;

        setTimeout(() => this.itemPicker?.scrollToFocusedValue());

        if (focusInput && shouldFocusInput())
        {
            this.inputElement.focus();
            setTimeout(() => this.inputElement.focus());
        }
    }

    /**
     * Closes the dropdown and optionally focuses the toggle icon.
     * Also reverts the focused value if no value was picked.
     * @param focusToggle True to focus the toggle icon, otherwise false.
     * @param pick True if the user picked a value, otherwise false.
     */
    protected closeDropdown(focusToggle: boolean, pick = false): void
    {
        this.open = false;

        if (pick)
        {
            if (this.focusedValue !== this.value)
            {
                this.value = this.focusedValue;

                if (this.value !== null)
                {
                    this.enteredValue = undefined;
                    this.isValid = true;
                }

                // Dispatch the `input` event to indicate that the comitted value, has changed.
                this._element.dispatchEvent(new CustomEvent("input", { bubbles: true, detail: { value: this.value } }));

                // Dispatch the `change` event to indicate that the comitted value, has changed.
                this._element.dispatchEvent(new CustomEvent("change", { bubbles: true, detail: { value: this.value } }));
            }
        }
        else
        {
            this.focusedValue = this.isValid ? this.value : null;
            this.enteredValue = undefined;
            this.isValid = true;
        }

        if (focusToggle)
        {
            this.toggleElement.focus();
            setTimeout(() => this.toggleElement.focus());
        }
    }

    /**
     * Called when the toggle icon or the input element is clicked.
     * Toggles the dropdown between its open and closed state, focusing either the input element or toggle icon.
     */
    protected toggleDropdown(): void
    {
        if (this.open)
        {
            this.closeDropdown(true, true);
        }
        else
        {
            this.openDropdown(true);
        }
    }

    /**
     * Called when the input element is clicked.
     * Opens the dropdown and focuses the input element.
     * @param event The mouse event.
     * @returns True to continue.
     */
    protected onInputMouseDown(event: MouseEvent): boolean
    {
        if (!event.defaultPrevented && !this.open)
        {
            this.openDropdown(true);
        }

        return true;
    }

    /**
     * Called when a key is pressed within the input element.
     * Prevents the user from entering some invalid values.
     * @param event The keyboard event.
     * @returns True to continue, false to prevent default.
     */
    protected onInputKeyDown(event: KeyboardEvent): boolean
    {
        if (event.defaultPrevented)
        {
            return true;
        }

        if (!this.isValid && !(event.altKey || event.metaKey || event.shiftKey || event.ctrlKey))
        {
            switch (event.key)
            {
                case "Enter":
                {
                    return false;
                }
            }
        }

        // Never block special keys or key combinations.
        if (!event.key || event.key.length > 1 || event.altKey || event.metaKey || event.shiftKey || event.ctrlKey)
        {
            return true;
        }

        // Prevent the user from entering characters that are not part of the pattern.
        if (!this.timeFormat.keyPattern.test(event.key))
        {
            return false;
        }

        return true;
    }

    /**
     * Called when a `mousedown` event occurs on the dropdown.
     * Prevents default for the event, so it won't cause unwanted effects in ancestor elements.
     * @returns False to prevent default.
     */
    protected onDropdownMouseDown(): boolean
    {
        return false;
    }

    /**
     * Called when the input, or an element within the input, receives focus.
     * Opens the dropdown if the focused element is not the toggle icon.
     * @param event The focus event.
     */
    protected onInputFocusIn(event: FocusEvent): void
    {
        if (event.target !== this.toggleElement && !this.open)
        {
            this.openDropdown(false);
        }
    }

    /**
     * Called when an event is triggered.
     * Prevents the event from bubbling further, as this input dispatches its own event.
     * @param event The event.
     */
    protected onInternalEvent(event: Event): void
    {
        event.stopPropagation();
    }

    /**
     * Called by the framework when the `value` property changes.
     * Ensures the focused value matches the new value.
     */
    protected valueChanged(): void
    {
        this.focusedValue = this.value;
    }

    /**
     * Schedules updates of the `now` value.
     */
    private scheduleNowRefresh(): void
    {
        this._nowIntervalHandle = setInterval(() =>
        {
            this._now = DateTime.local().setZone(this.zone);
        }, 1000);
    }
}
