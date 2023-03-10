import { computedFrom } from "aurelia-framework";
import { textCase } from "shared/utilities";

/**
 * Represents the data for a locale.
 */
export interface ILocale
{
    /**
     * The IETF language tag identifying the locale, excluding any unicode extension.
     * This value is case sensitive and consists of a lower-case ISO 639-1 language code, optionally
     * followed by a lower-case ISO 15924 script code, an upper-case ISO 3166-1 Alpha 2 country code,
     * and a private use subtag, in that order.
     */
    code: string;

    /**
     * The IETF language tag extensions, specifying calendar, numbering system, etc.
     * This value is case sensitive and must consist of the string starting with `u-`.
     */
    unicodeExtension?: string;

    /**
     * The name of the locale, used if no localized name is available.
     */
    name?: string;

    /**
     * The names identifying the environments in which the locale should only be available,
     * or undefined if the locale should be available in all environments.
     */
    environments?: string[];
}

/**
 * Represents a locale.
 */
export class Locale
{
    /**
     * Creates a new instance of the type.
     * @param data The data from which the instance should be created.
     */
    public constructor(data: ILocale)
    {
        this._name = data.name;
        this.code = data.code;
        this.environments = data.environments;

        if (data.unicodeExtension)
        {
            // Insert the unicode extension between the code and the private use subtag.
            this.codeWithUnicodeExtension = this.code.replace(/(?=-x-)|$/, `-${data.unicodeExtension}`);
        }
        else
        {
            this.codeWithUnicodeExtension = this.code;
        }
    }

    private readonly _name: string | undefined;

    /**
     * The IETF language tag identifying the locale, excluding any unicode extension.
     * This value is case sensitive and consists of a lower-case ISO 639-1 language code, optionally
     * followed by a lower-case ISO 15924 script code, an upper-case ISO 3166-1 Alpha 2 country code,
     * and a private use subtag, in that order.
     * This is the code that should be used to identify the locale.
     */
    public readonly code: string;

    /**
     * The IETF language tag, including any unicode extension.
     * This value is case sensitive and consists of the code, including any unicode extension,
     * which may specify which calendar, numbering system, etc. should be used.
     * This is the code that should be used when formatting values.
     */
    public readonly codeWithUnicodeExtension: string;

    /**
     * The names identifying the environments in which the locale should only be available,
     * or undefined if the locale should be available in all environments.
     */
    public readonly environments: string[] | undefined;

    /**
     * The name of the locale, which may be localized.
     */
    @computedFrom("code", "_name")
    public get name(): string
    {
        if (this._name != null)
        {
            return this._name;
        }

        if (Intl.DisplayNames != null)
        {
            const [code, privateUseSubtag] = this.code.split(/-x-(.*)/);
            const displayNames = new Intl.DisplayNames(code, { type: "language", fallback: "none" });
            let displayName = displayNames.of(code);

            if (privateUseSubtag)
            {
                displayName += ` [${privateUseSubtag}]`;
            }

            return displayName ? textCase(displayName, "space", "sentence", true) : this._name || this.code;
        }

        return this._name || this.code;
    }
}
