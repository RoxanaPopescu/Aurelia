import { autoinject } from "aurelia-framework";
import { Duration } from "luxon";

/**
 * Represents a value converter that formats a duration as a localized duration string.
 * See the `Luxon` API docs for details.
 */
@autoinject
export class DurationValueConverter
{
    /**
     * Converts the value for use in the view,
     * formatting the specified value as a localized duration string.
     * @param value The value to format.
     * @returns A localized string representing the value.
     */
    public toView(value: Duration | undefined | null): string | null | undefined
    {
        if (value == null)
        {
            return value;
        }

        return value.toFormat("h:mm");
    }
}
