import { autoinject } from "aurelia-framework";
import { Duration } from "luxon";
import { TemplateStringParser, TemplateString } from "shared/infrastructure";
import durationFormatStrings from "./resources/strings/duration-format.json";

/**
 * Represents a value converter that formats a duration as a localized duration string.
 * See the `Luxon` API docs for details.
 */
@autoinject
export class DurationValueConverter
{
    /**
     * Creates a new instance of the type.
     * @param templateStringParser The `TemplateStringParser` instance.
     */
    public constructor(templateStringParser: TemplateStringParser)
    {
        for (const key of Object.keys(durationFormatStrings))
        {
            this._formats.set(key, templateStringParser.parse(durationFormatStrings[key]));
        }
    }

    private readonly _formats = new Map<string, TemplateString>();

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

        let parts: any;

        parts = value.shiftTo("years", "months", "days", "hours", "minutes", "seconds").toObject();

        if (parts.years && parts.months)
        {
            return this._formats.get("years,months")?.evaluate(parts);
        }

        if (parts.years)
        {
            return this._formats.get("years")?.evaluate(parts);
        }

        if (parts.months && parts.days)
        {
            return this._formats.get("months,days")?.evaluate(parts);
        }

        if (parts.months)
        {
            return this._formats.get("months")?.evaluate(parts);
        }

        if (parts.days)
        {
            return this._formats.get("days")?.evaluate(parts);
        }

        if (parts.days && parts.hours)
        {
            return this._formats.get("days,hours")?.evaluate(parts);
        }

        if (parts.days)
        {
            return this._formats.get("days")?.evaluate(parts);
        }

        if (parts.hours && parts.minutes)
        {
            return this._formats.get("hours,minutes")?.evaluate(parts);
        }

        if (parts.hours)
        {
            return this._formats.get("hours")?.evaluate(parts);
        }

        if (parts.minutes && parts.seconds)
        {
            return this._formats.get("minutes,seconds")?.evaluate(parts);
        }

        if (parts.minutes)
        {
            return this._formats.get("minutes")?.evaluate(parts);
        }

        if (parts.seconds)
        {
            return this._formats.get("seconds")?.evaluate(parts);
        }

        return this._formats.get("seconds")?.evaluate({ seconds: 0 });
    }
}
