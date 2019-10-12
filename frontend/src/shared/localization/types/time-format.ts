import { DateTime } from "luxon";
import { escapeRegExp } from "shared/utilities";
import * as formatTokens from "../resources/strings/format-tokens.json";

// The date used when resolving format parts.
const date = DateTime.fromMillis(0);

/**
 * Represents a time format for a specific locale.
 */
export class TimeFormat
{
    /**
     * Creates a new instance of the type.
     * @param localeCode The IETF language tag identifying the locale associated
     * with the format, or undefined to create the format for the current locale.
     */
    public constructor(localeCode?: string)
    {
        const parts = date.toLocaleParts(
        {
            ...DateTime.TIME_24_SIMPLE,
            locale: localeCode ? `${localeCode}-u-ca-iso8601-nu-latn` : undefined
        });

        for (const part of parts)
        {
            switch (part.type)
            {
                case "hour":
                {
                    part.token = "M";
                    part.value = Array(2).fill(formatTokens.hour).join("");
                    part.inputPattern = ["(\\d(\\d", ")?)?"];
                    part.keyPattern = "\\d";
                    break;
                }
                case "minute":
                {
                    part.token = "d";
                    part.value = Array(2).fill(formatTokens.minute).join("");
                    part.inputPattern = ["(\\d(\\d", ")?)?"];
                    part.keyPattern = "\\d";
                    break;
                }
                default:
                {
                    part.token = part.value;
                    part.inputPattern = [part.value.replace(/./g, $0 => `(${escapeRegExp($0)}`), part.value.replace(/./g, ")?")];
                    part.keyPattern = [...part.value].map(c => escapeRegExp(c)).join("|");
                    break;
                }
            }
        }

        this.displayFormat = parts.map(part => part.value).join("");
        this.inputFormat = parts.map(part => part.token).join("");
        this.inputPattern = new RegExp(`^${[...parts.map(part => part.inputPattern[0]), ...parts.map(part => part.inputPattern[1])].join("")}$`);
        this.keyPattern = new RegExp(`^${[...parts.map(part => part.keyPattern)].join("|")}$`);
    }

    /**
     * The format string to present to users.
     */
    public readonly displayFormat: string;

    /**
     * The format string to use for parsing user input.
     * Note that this format is specific to the Luxon package.
     */
    public readonly inputFormat: string;

    /**
     * The pattern to use when validating user input while the user is typing.
     * Note that the actual validity of the input should always be determined
     * based on whether the input was be successfully parsed.
     */
    public readonly inputPattern: RegExp;

    /**
     * The pattern to use when validating whether a character being typed is valid.
     */
    public readonly keyPattern: RegExp;
}
