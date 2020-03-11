import { autoinject } from "aurelia-framework";
import { DateTime } from "luxon";
import { WeekdayValueConverter, WeekdayStyle } from "../weekday/weekday";
import { ListValueConverter } from "../list/list";
import { textCase } from "shared/utilities";

/**
 * Represents a value converter that formats a sequence of dates or ISO weekday numbers as a localized sequence of weekday names.
 */
@autoinject
export class WeekdayListValueConverter
{
    /**
     * Creates a new instance of the type.
     * @param weekdayValueConverter The `WeekdayValueConverter` instance.
     * @param listValueConverter The `ListValueConverter` instance.
     */
    public constructor(weekdayValueConverter: WeekdayValueConverter, listValueConverter: ListValueConverter)
    {
        this._weekdayValueConverter = weekdayValueConverter;
        this._listValueConverter = listValueConverter;
    }

    private readonly _weekdayValueConverter: WeekdayValueConverter;
    private readonly _listValueConverter: ListValueConverter;

    /**
     * The signals that should trigger a binding update.
     */
    public readonly signals = ["locale-changed"];

    /**
     * Converts a value for use in the View,
     * formatting the specified sequence of dates or ISO weekday numbers as a localized sequence of weekday names, using the specified style.
     * @param value The items to format as a list.
     * @param style The style to use. The default is `long`.
     * @param convert True to convert to the current time zone, otherwise false. The default is true.
     * @returns A localized string representing the sequence of items.
     */
    public toView(value: (DateTime | number)[] | undefined | null, style: WeekdayStyle = "long", convert = true): string | null | undefined
    {
        if (value == null)
        {
            return value;
        }

        return this._listValueConverter.toView(value.map(v => textCase([this._weekdayValueConverter.toView(v, style, convert)!], "sentence")), "short", "unit");
    }
}
