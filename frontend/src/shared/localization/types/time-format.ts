import { autoinject } from "aurelia-framework";
import { DateTime } from "luxon";
import { escapeRegExp } from "shared/utilities";
import { LocaleService } from "../services/locale";
import * as formatTokens from "../resources/strings/format-tokens.json";

// The date used when resolving format parts.
const date = DateTime.fromMillis(0);

/**
 * Represents a time format for a specific locale.
 */
@autoinject
export class TimeFormat
{
    /**
     * Creates a new instance of the type.
     * @param localeService The `LocaleService`instance.
     */
    public constructor(localeService: LocaleService)
    {
        const localeCodeWithExtension = `${localeService.locale.code}${localeService.locale.extension}`;
        const dateParts = date.toLocaleParts(
        {
            ...DateTime.TIME_24_SIMPLE,
            locale: localeCodeWithExtension
        });

        const parts = dateParts.map(part =>
        {
            switch (part.type)
            {
                case "hour":
                {
                    return {
                        token: "M",
                        value: Array(2).fill(formatTokens.hour).join(""),
                        inputPattern: ["(\\d(\\d", ")?)?"],
                        keyPattern: "\\d"
                    };
                }
                case "minute":
                {
                    return {
                        token: "d",
                        value: Array(2).fill(formatTokens.minute).join(""),
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
     * based on whether the input was be successfully parsed.
     */
    public readonly inputPattern: RegExp;

    /**
     * The pattern to use when validating whether a character being typed is valid.
     */
    public readonly keyPattern: RegExp;
}
