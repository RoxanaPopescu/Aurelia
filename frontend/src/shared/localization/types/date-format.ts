import { autoinject } from "aurelia-framework";
import { DateTime } from "luxon";
import { escapeRegExp } from "shared/utilities";
import { LocaleService } from "../services/locale";
import formatTokens from "../resources/strings/format-tokens.json";

// The date used when resolving format parts.
const date = DateTime.fromMillis(0);

/**
 * Represents a date format for a specific locale.
 */
@autoinject
export class DateFormat
{
    /**
     * Creates a new instance of the type.
     * @param localeService The `LocaleService`instance.
     */
    public constructor(localeService: LocaleService)
    {
        // Get the locale code, including any unicode extension.
        const localeCodeWithExtension = localeService.locale.codeWithUnicodeExtension;

        // Get the date format parts.
        const dateParts = date.toLocaleParts(
        {
            ...DateTime.DATE_SHORT,
            locale: localeCodeWithExtension
        });

        // Extract the relevant info from the date format parts.

        const parts = dateParts.map(part =>
        {
            switch (part.type)
            {
                case "year":
                {
                    return {
                        token: "y",
                        value: Array(4).fill(formatTokens.year).join(""),
                        inputPattern: ["(\\d(\\d(\\d(\\d", ")?)?)?)?"],
                        keyPattern: "\\d"
                    };
                }
                case "month":
                {
                    return {
                        token: "M",
                        value: Array(2).fill(formatTokens.month).join(""),
                        inputPattern: ["(\\d(\\d", ")?)?"],
                        keyPattern: "\\d"
                    };
                }
                case "day":
                {
                    return {
                        token: "d",
                        value: Array(2).fill(formatTokens.day).join(""),
                        inputPattern: ["(\\d(\\d", ")?)?"],
                        keyPattern: "\\d"
                    };
                }
                default:
                {
                    return {
                        token: part.value,
                        value: part.value,
                        inputPattern: [part.value.replace(/./g, ($0: string) => `(${escapeRegExp($0)}`), part.value.replace(/./g, ")?")],
                        keyPattern: [...part.value].map(c => escapeRegExp(c)).join("|")
                    };
                }
            }
        });

        this.displayFormat = parts.map(part => part.value).join("");
        this.inputFormat = parts.map(part => part.token).join("");
        this.inputPattern = new RegExp(`^${[...parts.map(part => part.inputPattern[0]), ...parts.map(part => part.inputPattern[1])].join("")}$`);
        this.keyPattern = new RegExp(`^(${[...parts.map(part => part.keyPattern)].join("|")})$`);
    }

    /**
     * The format string to present to users.
     */
    public readonly displayFormat: string;

    /**
     * The format string to use for parsing user input.
     * Note that this format is specific to the `luxon` package.
     */
    public readonly inputFormat: string;

    /**
     * The pattern to use when validating user input while the user is typing.
     * Note that the actual validity of the input should always be determined
     * based on whether the input was successfully parsed.
     */
    public readonly inputPattern: RegExp;

    /**
     * The pattern to use when validating whether a character being typed is valid.
     */
    public readonly keyPattern: RegExp;
}
