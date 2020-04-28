import { computedFrom } from "aurelia-framework";
import { textCase } from "shared/utilities";
import { LocaleService } from "../locale";

/**
 * Represents the data for a currency.
 */
export interface ICurrency
{
    /**
     * The ISO 4217 currency code identifying the currency.
     * This value is case sensitive.
     */
    code: string;

    /**
     * The name of the currency, used if no localized name is available.
     */
    name?: string;

    /**
     * True if the currency should only be available if debugging is enabled, otherwise false.
     */
    debug?: boolean;
}

/**
 * Represents a currency.
 */
export class Currency
{
    /**
     * Creates a new instance of the type.
     * @param data The data from which the instance should be created.
     * @param localeService The `LocaleService` instance.
     */
    public constructor(data: ICurrency, localeService: LocaleService)
    {
        this._name = data.name;
        this._localeService = localeService;
        this.code = data.code;
        this.debug = data.debug ?? false;
    }

    private readonly _localeService: LocaleService;
    private readonly _name: string | undefined;

    /**
     * The ISO 4217 currency code identifying the currency.
     * This value is case sensitive.
     */
    public readonly code: string;

    /**
     * True if the currency should only be available if debugging is enabled, otherwise false.
     */
    public readonly debug: boolean;

    /**
     * The name of the currency, which may be localized.
     */
    @computedFrom("code", "_name", "_localeService.locale.code")
    public get name(): string
    {
        if (Intl.DisplayNames != null && this._localeService.locale != null)
        {
            const displayNames = new Intl.DisplayNames(this._localeService.locale.code, { type: "currency", fallback: "none" });
            const displayName = displayNames.of(this.code);

            return displayName ? textCase(displayName, "space", "sentence", true) : this._name || this.code;
        }

        return this._name || this.code;
    }
}
