import { autoinject, bindable, bindingMode, observable } from "aurelia-framework";
import { DateTime, Info, Zone } from "luxon";
import { EventManager } from "shared/utilities";
import { DatesModel } from "./model/dates-model";
import { MonthsModel } from "./model/months-model";
import { YearsModel } from "./model/years-model";

/**
 * Custom element representing a picker for picking a date.
 */
@autoinject
export class DatePickerCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     */
    public constructor(element: Element)
    {
        this._element = element as HTMLElement;
    }

    private readonly _element: HTMLElement;
    private readonly _eventManager = new EventManager(this);
    private _isSettingValueInternally = false;

    /**
     * The model for the current view.
     */
    protected model: DatesModel | MonthsModel | YearsModel;

    /**
     * The names of the weekdays, ordered according to locale rules.
     */
    protected weekdays = Info.weekdays("short").map(d => d.substring(0, 2));

    /**
     * True to highlight items when hovered, otherwise false.
     */
    protected hoverable = false;

    /**
     * The view currently being presented.
     */
    @observable
    public view: "years" | "months" | "dates";

    /**
     * The date of today.
     */
    public today: DateTime;

    /**
     * The date used as a reference for navigation.
     */
    public cursor: DateTime;

    public minValue: DateTime | undefined;
    public maxValue: DateTime | undefined;

    /**
     * The IANA Time Zone Identifier to use, "local" to use the local zone, or "utc" to use the UTC zone.
     */
    @bindable({ defaultValue: "local" })
    public zone: string | Zone;

    /**
     * The picked date, or undefined if no date has been picked.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public value: DateTime | undefined;

    /**
     * The focused date, or undefined if no date is focused.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public focusedValue: DateTime | undefined;

    /**
     * The earliest date that can be selected, or undefined to disable this constraint.
     * Note that for can be an ISO 8601 string, "today", or a `DateTime` instance.
     */
    @bindable({ defaultValue: undefined })
    public min: string | DateTime | undefined;

    /**
     * The latest date that can be selected, or undefined to disable this constraint.
     * Note that for can be an ISO 8601 string, "today", or a `DateTime` instance.
     */
    @bindable({ defaultValue: undefined })
    public max: string | DateTime | undefined;

    /**
     * The element that has input focus.
     * This must be set to enable keyboard navigation.
     */
    @bindable({ defaultValue: undefined })
    public focusedElement: HTMLElement;

    /**
     * True to enable keyboard navigation, otherwise false.
     */
    @bindable({ defaultValue: true })
    public keyboard: boolean;

    /**
     * Called when the user picks an item.
     */
    @bindable({ defaultValue: undefined })
    public pick: () => void;

    /**
     * Called by the framework when the component is binding.
     */
    public bind(): void
    {
        this.focusedElement = this.focusedElement || this._element;
        this.today = DateTime.local().setZone(this.zone).startOf("day");
        this.cursor = (this.value || this.today).startOf("day");
        this.focusedValue = this.value;

        this.minChanged();
        this.maxChanged();

        this.view = "dates";
        this.viewChanged();
    }

    /**
     * Called by the framework when the component is attached.
     * Ensures keyboard listeners are attached.
     */
    public attached(): void
    {
        this.keyboardChanged();
    }

    /**
     * Changes the value of the item picker to the specified value and dispatches an `input` event,
     * and if the user picked the value, dispatches a `change` event and calls the `pick` callback.
     * @param value The new value.
     * @param pick True if the user picked the value, otherwise false.
     */
    public changeValue(value: DateTime | undefined, pick = false): void
    {
        // Set the focused value to match the new value.
        this.focusedValue = value;

        // Dispatch the `input` event to indicate that the focused value, and possibly the value, has changed.
        this._element.dispatchEvent(new CustomEvent("input", { bubbles: true, detail: { value } }));

        // Did the user pick the value?
        if (pick)
        {
            // Set the flag used to prevent navigation to the `dates` view when the value changes.
            this._isSettingValueInternally = true;

            // Set the value.
            this.value = value;

            // Dispatch the `change` event to indicate that the comitted value, has changed.
            this._element.dispatchEvent(new CustomEvent("change", { bubbles: true, detail: { value } }));

            // If the user picked the value, call the `pick` callback.
            if (this.pick != null)
            {
                // HACK: Delay the callback so the new value has a chance to propagate through the bindings.
                // tslint:disable-next-line: no-floating-promises
                Promise.resolve().then(() => this.pick()).catch(error => console.error(error));
            }
        }
    }

    /**
     * Called when the title is clicked, or when navigating between views using the keyboard.
     * @param direction The direction to zoom, or undefined to zoom in and loop.
     * Navigates to the parent view.
     */
    protected zoom(direction?: "in" | "out"): void
    {
        switch (this.view)
        {
            case "dates": this.view = direction === "out" ? "months" : direction === "in" ? "dates" : "months"; break;
            case "months": this.view = direction === "out" ? "years" : direction === "in" ? "dates" : "years"; break;
            case "years": this.view = direction === "out" ? "years" : direction === "in" ? "months" : "dates"; break;
        }
    }

    /**
     * Called by the framework when the `view` property changes.
     * Creates model for the view.
     */
    protected viewChanged(): void
    {
        switch (this.view)
        {
            case "dates": this.model = new DatesModel(this); break;
            case "months": this.model = new MonthsModel(this); break;
            case "years": this.model = new YearsModel(this); break;
        }
    }

    /**
     * Called by the framework when the `keyboard` property changes.
     * Adds or removes keyboard event listeners.
     */
    protected keyboardChanged(): void
    {
        // Dispose event listeners.
        this._eventManager.removeEventListeners();

        if (this.keyboard)
        {
            // Listen for keyboard events.
            this._eventManager.addEventListener(this.focusedElement, "keydown", event => this.onKeyDown(event as KeyboardEvent));

            // Listen for `focusin` events, so we can return focus to the focused element.
            this._eventManager.addEventListener(this._element, "focusin", () => this.onFocusIn());
        }
    }

    /**
     * Called by the framework when the `value` property changes.
     * Updates the cursor and focused value to match the new value,
     * and if the value was set from outside the component,
     * navigates to the `dates` view.
     */
    protected valueChanged(): void
    {
        // Update the focused value to match the new value.
        this.focusedValue = this.value;

        if (this.value != null)
        {
            // Update the cursor to match the new value.
            this.cursor = this.value.startOf("day");

            // If the value was set from outside the component, navigate to the `dates` view.
            if (!this._isSettingValueInternally)
            {
                this.view = "dates";
            }
        }

        // Reset the flag used to prevent navigation to the `dates` view when the value changes.
        this._isSettingValueInternally = false;
    }

    /**
     * Called by the framework when the `min` property changes.
     */
    protected minChanged(): void
    {
        if (typeof this.min === "string")
        {
            this.minValue = this.min === "today" ? this.today : DateTime.fromISO(this.min).setZone(this.zone);
        }

        this.viewChanged();
    }

    /**
     * Called by the framework when the `max` property changes.
     */
    protected maxChanged(): void
    {
        if (typeof this.max === "string")
        {
            this.maxValue = this.max === "today" ? this.today : DateTime.fromISO(this.max).setZone(this.zone);
        }

        this.viewChanged();
    }

    /**
     * Called by the framework when the `focusedValue` property changes.
     * Updates the cursor and if needed re-renders the items.
     */
    protected focusedValueChanged(): void
    {
        if (this.focusedValue != null)
        {
            const cursorBefore = this.cursor;

            // Update the cursor to match the new value.
            this.cursor = this.focusedValue.startOf("day");

            // Re-rendering is expensive, so avoid doing it too often.
            if (!this.cursor.hasSame(cursorBefore, "month"))
            {
                this.viewChanged();
            }
        }
    }

    /**
     * Called when the mouse is moved over the date picker.
     * Switches to mouse mode, where hover effects are enabled.
     * @returns True to continue.
     */
    protected onMouseMove(): boolean
    {
        // The user is using the mouse, so enable hover effects.
        this.hoverable = true;

        return true;
    }

    /**
     * Called when any part of the component receives focus.
     * Returns focus to the element specified as the focused element.
     */
    private onFocusIn(): void
    {
        this.focusedElement.focus();
    }

    /**
     * Called when a key is pressed within the focused element.
     * handles keyboard navigation in the grid and between views.
     * @param event The keyboard event.
     */
    private onKeyDown(event: KeyboardEvent): void
    {
        // The user is using the keyboard, so disable hover effects.
        this.hoverable = false;

        if (event.defaultPrevented)
        {
            return;
        }

        if (!(event.altKey || event.metaKey || event.shiftKey || event.ctrlKey))
        {
            switch (event.key)
            {
                case "Home":
                {
                    this.changeValue(this.today);
                    this.view = "dates";
                    event.preventDefault();

                    return;
                }
            }
        }

        if ((event.altKey || event.metaKey) && !(event.shiftKey || event.ctrlKey))
        {
            switch (event.key)
            {
                case "ArrowUp":
                {
                    this.zoom("out");
                    event.preventDefault();

                    return;
                }

                case "ArrowDown":
                {
                    this.zoom("in");
                    event.preventDefault();

                    return;
                }
            }
        }

        this.model.onKeyDown(event);
    }
}
