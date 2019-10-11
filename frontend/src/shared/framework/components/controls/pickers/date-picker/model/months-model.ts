import { computedFrom } from "aurelia-binding";
import { DateTime, DurationObject } from "luxon";
import { DatePickerCustomElement } from "../date-picker";

/**
 * Represents the model for the months view.
 */
export class MonthsModel
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
        return this._datePicker.cursor.toFormat("yyyy");
    }

    /**
     * The items to present.
     */
    @computedFrom("_datePicker.cursor")
    public get items(): MonthItem[]
    {
        const items: MonthItem[] = [];

        for (let i = 0; i < 12; i++)
        {
            const date = this._datePicker.cursor.startOf("year").plus({ months: i });
            items.push(new MonthItem(this._datePicker, date));
        }

        return items;
    }

    /**
     * True if today is outside the selectable range, otherwise false.
     */
    @computedFrom("_datePicker.cursor", "_datePicker.minValue", "_datePicker.maxValue")
    public get isPreviousDisabled(): boolean
    {
        const date = this._datePicker.cursor.startOf("year").minus({ months: 1 });
        const item = new MonthItem(this._datePicker, date);

        return item.isDisabled;
    }

    /**
     * True if today is outside the selectable range, otherwise false.
     */
    @computedFrom("_datePicker.cursor", "_datePicker.minValue", "_datePicker.maxValue")
    public get isNextDisabled(): boolean
    {
        const date = this._datePicker.cursor.startOf("year").plus({ year: 1 });
        const item = new MonthItem(this._datePicker, date);

        return item.isDisabled;
    }

    /**
     * Called when the `Previous` icon is clicked.
     * Navigates to the previous month.
     */
    public onPreviousClick(): void
    {
        this._datePicker.cursor = this._datePicker.cursor.minus({ year: 1 });
    }

    /**
     * Called when the `Next` icon is clicked.
     * Navigates to the next month.
     */
    public onNextClick(): void
    {
        this._datePicker.cursor = this._datePicker.cursor.plus({ year: 1 });
    }

    /**
     * Called when an item is clicked.
     * Sets the `value` property to the date represented by the clicked item.
     * @param item The item being clicked.
     */
    public onItemClick(item: MonthItem): void
    {
        if (!item.isDisabled)
        {
            this._datePicker.cursor = item.date;
            this._datePicker.view = "dates";
        }
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
            if (this._datePicker.focusedValue != null)
            {
                this._datePicker.view = "dates";
            }

            event.preventDefault();

            return;
        }

        let offset: DurationObject | undefined;

        switch (event.key)
        {
            case "PageUp": offset = { year: -1 }; break;
            case "PageDown": offset = { year: 1 }; break;
            case "ArrowUp": offset = { month: -3 }; break;
            case "ArrowDown": offset = { month: 3 }; break;
            case "ArrowLeft": offset = { month: -1 }; break;
            case "ArrowRight": offset = { month: 1 }; break;
        }

        if (offset != null)
        {
            const value = (this._datePicker.focusedValue || this._datePicker.today).plus(offset);
            const item = new MonthItem(this._datePicker, value);

            if (!item.isDisabled)
            {
                this._datePicker.changeValue(value);
            }

            event.preventDefault();
        }
    }
}

/**
 * Represents an item in the month grid.
 */
class MonthItem
{
    /**
     * Creates a new instance of the type.
     * @param datePicker The `DatePickerCustomElement` owning the item.
     * @param date The cursor date represented by the item.
     */
    public constructor(datePicker: DatePickerCustomElement, date: DateTime)
    {
        this._datePicker = datePicker;
        this.date = date;
    }

    private readonly _datePicker: DatePickerCustomElement;

    /**
     * The cursor date represented by this item.
     */
    public readonly date: DateTime;

    /**
     * The value to display.
     */
    @computedFrom("date")
    public get displayValue(): string
    {
        return this.date.toFormat("MMM");
    }

    /**
     * True if the month matches the month of today, otherwise false.
     */
    @computedFrom("_datePicker.today")
    public get isToday(): boolean
    {
        return this.date.hasSame(this._datePicker.today, "month");
    }

    /**
     * True if the month matches the month of the selected date, otherwise false.
     */
    @computedFrom("_datePicker.focusedValue")
    public get isSelected(): boolean
    {
        return this._datePicker.focusedValue != null && this.date.hasSame(this._datePicker.focusedValue, "month");
    }

    /**
     * True if the month is outside the year of the cursor date, otherwise false.
     */
    @computedFrom("_datePicker.cursor")
    public get isOutsideRange(): boolean
    {
        return !this.date.hasSame(this._datePicker.cursor, "year");
    }

    /**
     * True if the month is disabled, otherwise false.
     */
    @computedFrom("_datePicker.minValue", "_datePicker.maxValue", "date")
    public get isDisabled(): boolean
    {
        return (
            this._datePicker.minValue != null && this.date.startOf("month").diff(this._datePicker.minValue.startOf("month")).valueOf() < 0 ||
            this._datePicker.maxValue != null && this.date.startOf("month").diff(this._datePicker.maxValue.startOf("month")).valueOf() > 0
        );
    }
}
