import { autoinject } from "aurelia-framework";
import { escapeRegExp } from "shared/utilities";
import { LocaleService } from "../services/locale";

// The date used when resolving format parts.
const number = -1.1;

/**
 * Represents a date format for a specific locale.
 */
@autoinject
export class NumberFormat
{
    /**
     * Creates a new instance of the type.
     * @param localeService The `LocaleService`instance.
     */
    public constructor(localeService: LocaleService)
    {
        const localeCodeWithExtension = `${localeService.locale.code}${localeService.locale.extension}`;
        const numberFormat = new Intl.NumberFormat(localeCodeWithExtension);

        const numberParts = numberFormat.formatToParts(number);

        const parts = numberParts.map((part: any) =>
        {
            switch (part.type)
            {
                case "integer":
                {
                    return {
                        validPattern: "\\d+",
                        inputPattern: ["(\\d+", ")?"],
                        keyPattern: "\\d"
                    };
                }
                case "fraction":
                {
                    return {
                        validPattern: "\\d+)?",
                        inputPattern: ["(\\d+", ")?"],
                        keyPattern: "\\d"
                    };
                }
                case "decimal":
                {
                    return {
                        validPattern: `(${escapeRegExp(part.value)}`,
                        inputPattern: [`(${escapeRegExp(part.value)}`, ")?"],
                        keyPattern: escapeRegExp(part.value)
                    };
                }
                case "minusSign":
                {
                    return {
                        validPattern: `(${escapeRegExp(part.value)})?`,
                        inputPattern: [`((${escapeRegExp(part.value)})?`, ")?"],
                        keyPattern: escapeRegExp(part.value)
                    };
                }
                default:
                {
                    throw new Error("Unexpected format part.");
                }
            }
        });

        this.validPattern = new RegExp(`^${parts.map(part => part.validPattern).join("")}$`);
        this.inputPattern = new RegExp(`^${[...parts.map(part => part.inputPattern[0]), ...parts.map(part => part.inputPattern[1])].join("")}$`);
        this.keyPattern = new RegExp(`^(${[...parts.map(part => part.keyPattern)].join("|")})$`);
        this.decimalSeparator = numberParts.find(p => p.type === "decimal")!.value;
        this.groupSeparator = numberParts.find(p => p.type === "group")?.value;
        this.minusSign = numberParts.find(p => p.type === "minusSign")!.value;
    }

    /**
     * The pattern to use when validating user input before parsing.
     */
    public readonly validPattern: RegExp;

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

    /**
     * The minus sign to use.
     */
    public readonly minusSign: string;

    /**
     * The decimal separator to use.
     */
    public readonly decimalSeparator: string;

    /**
     * The group separator to use, if any.
     */
    public readonly groupSeparator: string | undefined;
}
