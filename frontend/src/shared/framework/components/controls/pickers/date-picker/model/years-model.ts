import { computedFrom } from "aurelia-binding";
import { DateTime, DurationObject } from "luxon";
import { DatePickerCustomElement } from "../date-picker";

/**
 * Represents the model for the years view.
 */
export class YearsModel
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
        const decadeStartYear = Math.floor(this._datePicker.cursor.year / 10) * 10;

        return `${decadeStartYear} – ${decadeStartYear + 9}`;
    }

    /**
     * The items to present.
     */
    @computedFrom("_datePicker.cursor")
    public get items(): YearItem[]
    {
        const items: YearItem[] = [];
        const startYear = Math.floor(this._datePicker.cursor.year / 10) * 10 - 1;

        for (let i = 0; i < 12; i++)
        {
            const date = this._datePicker.cursor.set({ year: startYear + i }).startOf("year");
            items.push(new YearItem(this._datePicker, date));
        }

        return items;
    }

    /**
     * True if today is outside the selectable range, otherwise false.
     */
    @computedFrom("_datePicker.cursor", "_datePicker.minValue", "_datePicker.maxValue")
    public get isPreviousDisabled(): boolean
    {
        const startYear = Math.floor(this._datePicker.cursor.year / 10) * 10 - 1;
        const date = this._datePicker.cursor.set({ year: startYear }).startOf("year");
        const item = new YearItem(this._datePicker, date);

        return item.isDisabled;
    }

    /**
     * True if today is outside the selectable range, otherwise false.
     */
    @computedFrom("_datePicker.cursor", "_datePicker.minValue", "_datePicker.maxValue")
    public get isNextDisabled(): boolean
    {
        const startYear = Math.floor(this._datePicker.cursor.year / 10) * 10 - 1;
        const date = this._datePicker.cursor.set({ year: startYear + 11 }).startOf("year");
        const item = new YearItem(this._datePicker, date);

        return item.isDisabled;
    }

    /**
     * Called when the `Previous` icon is clicked.
     * Navigates to the previous month.
     */
    public onPreviousClick(): void
    {
        this._datePicker.cursor = this._datePicker.cursor.minus({ years: 10 });
    }

    /**
     * Called when the `Next` icon is clicked.
     * Navigates to the next month.
     */
    public onNextClick(): void
    {
        this._datePicker.cursor = this._datePicker.cursor.plus({ years: 10 });
    }

    /**
     * Called when an item is clicked.
     * Sets the `value` property to the date represented by the clicked item.
     * @param item The item being clicked.
     */
    public onItemClick(item: YearItem): void
    {
        if (!item.isDisabled)
        {
            this._datePicker.cursor = item.date;
            this._datePicker.view = "months";
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
                this._datePicker.view = "months";
            }

            event.preventDefault();

            return;
        }

        let offset: DurationObject | undefined;

        switch (event.key)
        {
            case "PageUp": offset = { year: -10 }; break;
            case "PageDown": offset = { year: 10 }; break;
            case "ArrowUp": offset = { year: -3 }; break;
            case "ArrowDown": offset = { year: 3 }; break;
            case "ArrowLeft": offset = { year: -1 }; break;
            case "ArrowRight": offset = { year: 1 }; break;
        }

        if (offset != null)
        {
            const value = (this._datePicker.focusedValue || this._datePicker.today).plus(offset);
            const item = new YearItem(this._datePicker, value);

            if (!item.isDisabled)
            {
                this._datePicker.changeValue(value);
            }

            event.preventDefault();
        }
    }
}

/**
 * Represents an item in the year grid.
 */
class YearItem
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
        return this.date.year.toString();
    }

    /**
     * True if the year matches the year of today, otherwise false.
     */
    @computedFrom("_datePicker.today")
    public get isToday(): boolean
    {
        return this.date.hasSame(this._datePicker.today, "year");
    }

    /**
     * True if the year matches the year of the selected date, otherwise false.
     */
    @computedFrom("_datePicker.focusedValue")
    public get isSelected(): boolean
    {
        return this._datePicker.focusedValue != null && this.date.hasSame(this._datePicker.focusedValue, "year");
    }

    /**
     * True if the year is outside the decade of the cursor date, otherwise false.
     */
    @computedFrom("_datePicker.cursor")
    public get isOutsideRange(): boolean
    {
        return (
            this.date.year < Math.floor(this._datePicker.cursor.year / 10) * 10 ||
            this.date.year > Math.floor(this._datePicker.cursor.year / 10) * 10 + 9
        );
    }

    /**
     * True if the year is disabled, otherwise false.
     */
    @computedFrom("_datePicker.minValue", "_datePicker.maxValue", "date")
    public get isDisabled(): boolean
    {
        return (
            this._datePicker.minValue != null && this.date.startOf("year").diff(this._datePicker.minValue.startOf("year")).valueOf() < 0 ||
            this._datePicker.maxValue != null && this.date.startOf("year").diff(this._datePicker.maxValue.startOf("year")).valueOf() > 0
        );
    }
}
