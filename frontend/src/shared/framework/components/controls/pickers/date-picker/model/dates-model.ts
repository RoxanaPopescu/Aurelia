import { computedFrom } from "aurelia-binding";
import { DateTime, DurationObject } from "luxon";
import { DatePickerCustomElement } from "../date-picker";

/**
 * Represents the model for the dates view.
 */
export class DatesModel
{
    /**
     * Creates a new instance of the type.
     * @param datePicker The `DatePickerCustomElement` owning the item.
     */
    public constructor(datePicker: DatePickerCustomElement)
    {
        this._datePicker = datePicker;
    }

    private readonly _datePicker: DatePickerCustomElement;

    /**
     * The title to show.
     */
    @computedFrom("_datePicker.cursor")
    public get title(): string
    {
        return this._datePicker.cursor.toFormat("MMM yyyy");
    }

    /**
     * The items to present.
     */
    @computedFrom("_datePicker.cursor")
    public get items(): DateItem[]
    {
        const items: DateItem[] = [];

        for (let i = 0; i < 42; i++)
        {
            const date = this._datePicker.cursor.startOf("month").startOf("week").plus({ days: i });
            items.push(new DateItem(this._datePicker, date));
        }

        return items;
    }

    /**
     * True if today is outside the selectable range, otherwise false.
     */
    @computedFrom("_datePicker.cursor", "_datePicker.min", "_datePicker.max")
    public get isPreviousDisabled(): boolean
    {
        const date = this._datePicker.cursor.startOf("month").minus({ day: 1 });
        const item = new DateItem(this._datePicker, date);

        return item.isDisabled;
    }

    /**
     * True if today is outside the selectable range, otherwise false.
     */
    @computedFrom("_datePicker.cursor", "_datePicker.min", "_datePicker.max")
    public get isNextDisabled(): boolean
    {
        const date = this._datePicker.cursor.startOf("month").plus({ month: 1 });
        const item = new DateItem(this._datePicker, date);

        return item.isDisabled;
    }

    /**
     * True if today is outside the selectable range, otherwise false.
     */
    @computedFrom("_datePicker.today", "_datePicker.min", "_datePicker.max")
    public get isTodayDisabled(): boolean
    {
        const item = new DateItem(this._datePicker, this._datePicker.today);

        return item.isDisabled;
    }

    /**
     * Called when the `Previous` icon is clicked.
     * Navigates to the previous month.
     */
    public onPreviousClick(): void
    {
        this._datePicker.cursor = this._datePicker.cursor.minus({ month: 1 });
    }

    /**
     * Called when the `Next` icon is clicked.
     * Navigates to the next month.
     */
    public onNextClick(): void
    {
        this._datePicker.cursor = this._datePicker.cursor.plus({ month: 1 });
    }

    /**
     * Called when an item is clicked.
     * Sets the `value` property to the date represented by the clicked item.
     * @param item The item being clicked.
     */
    public onItemClick(item: DateItem): void
    {
        if (!item.isDisabled)
        {
            this._datePicker.changeValue(item.date, true);
        }
    }

    /**
     * Called when the `Today` button is clicked.
     * Sets the `value` property to the date of today.
     */
    public onTodayClick(): void
    {
        this._datePicker.changeValue(this._datePicker.today);
        this._datePicker.cursor = this._datePicker.today;
    }

    /**
     * Called when a key is pressed within the focused element.
     * Handles keyboard navigation within the view.
     * @param event The keyboard event.
     */
    public onKeyDown(event: KeyboardEvent): void
    {
        if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey)
        {
            return;
        }

        if (event.key === "Enter")
        {
            this._datePicker.changeValue(this._datePicker.focusedValue, true);
            event.preventDefault();

            return;
        }

        let offset: DurationObject | undefined;

        switch (event.key)
        {
            case "PageUp": offset = { month: -1 }; break;
            case "PageDown": offset = { month: 1 }; break;
            case "ArrowUp": offset = { day: -7 }; break;
            case "ArrowDown": offset = { day: 7 }; break;
            case "ArrowLeft": offset = { day: -1 }; break;
            case "ArrowRight": offset = { day: 1 }; break;
        }

        if (offset != null)
        {
            const value = (this._datePicker.focusedValue || this._datePicker.today).plus(offset);
            const item = new DateItem(this._datePicker, value);

            if (!item.isDisabled)
            {
                this._datePicker.changeValue(value);
            }

            event.preventDefault();
        }
    }
}

/**
 * Represents an item in the date grid.
 */
export class DateItem
{
    /**
     * Creates a new instance of the type.
     * @param datePicker The `DatePickerCustomElement` owning the item.
     * @param date The date represented by the item.
     */
    public constructor(datePicker: DatePickerCustomElement, date: DateTime)
    {
        this._datePicker = datePicker;
        this.date = date;
    }

    private readonly _datePicker: DatePickerCustomElement;

    /**
     * The date represented by this item.
     */
    public readonly date: DateTime;

    /**
     * The value to display.
     */
    @computedFrom("date")
    public get displayValue(): string
    {
        return this.date.day.toString();
    }

    /**
     * True if the date matches the date of today, otherwise false.
     */
    @computedFrom("_datePicker.today")
    public get isToday(): boolean
    {
        return this.date.hasSame(this._datePicker.today, "day");
    }

    /**
     * True if the date matches the selected date, otherwise false.
     */
    @computedFrom("_datePicker.focusedValue")
    public get isSelected(): boolean
    {
        return this._datePicker.focusedValue != null && this.date.hasSame(this._datePicker.focusedValue, "day");
    }

    /**
     * True if the date is outside the month of the cursor, otherwise false.
     */
    @computedFrom("_datePicker.cursor")
    public get isOutsideRange(): boolean
    {
        return !this.date.hasSame(this._datePicker.cursor, "month");
    }

    /**
     * True if the date is disabled, otherwise false.
     */
    @computedFrom("_datePicker.min", "_datePicker.max", "date")
    public get isDisabled(): boolean
    {
        return (
            this._datePicker.min != null && this.date.startOf("day").diff(this._datePicker.min.startOf("day")).valueOf() < 0 ||
            this._datePicker.max != null && this.date.startOf("day").diff(this._datePicker.max.startOf("day")).valueOf() > 0
        );
    }
}
