import { autoinject } from "aurelia-framework";
import { Duration } from "luxon";
import { TemplateStringParser, TemplateString } from "shared/infrastructure";
import durationFormatStrings from "./resources/strings/duration-format.json";

/**
 * Represents the supported duration style values.
 */
export type DurationStyle = "narrow" | "long";

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
     * The signals that should trigger a binding update.
     */
    public readonly signals = ["locale-changed"];

    /**
     * Converts the value for use in the view,
     * formatting the specified value as a localized duration string.
     * @param value The value to format.
     * @param style The style to use. The default is `narrow`.
     * @returns A localized string representing the value.
     */
    public toView(value: Duration | undefined | null, style: DurationStyle = "narrow"): string | null | undefined
    {
        if (value == null)
        {
            return value;
        }

        let parts: any;

        if (style === "narrow")
        {
            parts = value.shiftTo("years", "days", "hours", "minutes", "seconds").toObject();

            if (parts.years && parts.days)
            {
                return this.format(style, "years,days", parts);
            }

            if (parts.years)
            {
                return this.format(style, "years", parts);
            }

            if (parts.days && parts.hours)
            {
                return this.format(style, "days,hours", parts);
            }
        }

        if (style === "long")
        {
            parts = value.shiftTo("years", "months", "days", "hours", "minutes", "seconds").toObject();

            if (parts.years && parts.months)
            {
                return this.format(style, "years,months", parts);
            }

            if (parts.years)
            {
                return this.format(style, "years", parts);
            }

            if (parts.months && parts.days)
            {
                return this.format(style, "months,days", parts);
            }

            if (parts.months)
            {
                return this.format(style, "months", parts);
            }
        }

        if (parts.days)
        {
            return this.format(style, "days", parts);
        }

        if (parts.days && parts.hours)
        {
            return this.format(style, "days,hours", parts);
        }

        if (parts.days)
        {
            return this.format(style, "days", parts);
        }

        if (parts.hours && parts.minutes)
        {
            return this.format(style, "hours,minutes", parts);
        }

        if (parts.hours)
        {
            return this.format(style, "hours", parts);
        }

        if (parts.minutes && parts.seconds)
        {
            return this.format(style, "minutes,seconds", parts);
        }

        if (parts.minutes)
        {
            return this.format(style, "minutes", parts);
        }

        if (parts.seconds)
        {
            return this.format(style, "seconds", parts);
        }

        return this.format(style, "seconds", parts);
    }

    /**
     * Gets the localized duration string in the specified style and format,
     * based on the specified value parts.
     * @param style The style to use.
     * @param format The format to use.
     * @param parts The value parts to format.
     * @returns The localized duration string.
     */
    private format(style: DurationStyle, format: string, parts: object): string | undefined
    {
        return this._formats.get(`${style}:${format}`)!.evaluate(parts);
    }
}
