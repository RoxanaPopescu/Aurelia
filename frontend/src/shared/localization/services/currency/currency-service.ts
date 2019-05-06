import { autoinject, computedFrom } from "aurelia-framework";
import { ICurrency } from "./currency";

/**
 * Represents a function that will be called before the currency changes.
 * Use this to preparing the app for the new currency.
 * @param newCurrency The new currency being set.
 * @param oldCurrency The old currency, or undefined if not previously set.
 * @returns Nothing, or a promise that will be resolved when the app is ready for the new currency.
 */
type CurrencyChangeFunc = (newCurrency: ICurrency | undefined, oldCurrency: ICurrency) => void | Promise<void>;

/**
 * Represents a service that manages currencies.
 */
@autoinject
export class CurrencyService
{
    private _currencies: ICurrency[];
    private _currency: ICurrency;
    private _changeFunc: CurrencyChangeFunc;

    /**
     * Gets the supported currencies.
     */
    @computedFrom("_currencies")
    public get currencies(): ReadonlyArray<ICurrency>
    {
        return this._currencies;
    }

    /**
     * Gets the current currency.
     */
    @computedFrom("_currency")
    public get currency(): ICurrency
    {
        return this._currency;
    }

    /**
     * Configures the instance.
     * @param currencies The currencies supported by the app.
     * @param changeFunc The function that is invoked when setting the currency.
     */
    public configure(currencies: ICurrency[], changeFunc?: CurrencyChangeFunc): void
    {
        this._currencies = currencies;
        this._changeFunc = changeFunc || (() => undefined);
    }

    /**
     * Gets the currency with the specified currency code.
     * @param currencyCode The case-insensitive currency code.
     * @returns The currency with the specified currency code.
     */
    public getCurrency(currencyCode: string): ICurrency
    {
        const canonicalCurrencyCode = currencyCode.toUpperCase();
        const currency = this._currencies.find(c => c.code === canonicalCurrencyCode);

        if (currency == null)
        {
            throw new Error(`The currency '${canonicalCurrencyCode}' is not supported.`);
        }

        return currency;
    }

    /**
     * Sets the current currency.
     * @param currencyCode The new case-insensitive currency code.
     * @returns A promise that will be resolved with the `ICurrency` instance when the new currency is loaded.
     */
    public async setCurrency(currencyCode: string): Promise<ICurrency>
    {
        if (this._currency != null && currencyCode === this._currency.code)
        {
            return Promise.resolve(this._currency);
        }

        const currency = this.getCurrency(currencyCode);

        await this._changeFunc(currency, this._currency);

        this._currency = currency;

        return this._currency;
    }
}
