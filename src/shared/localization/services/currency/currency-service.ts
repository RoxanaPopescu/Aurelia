import { autoinject, computedFrom, signalBindings } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { LocaleService } from "../locale";
import { ICurrency, Currency } from "./currency";

/**
 * Represents a function that will be called before the currency changes.
 * Use this to prepare the app for the new currency.
 * @param newCurrency The new currency being set.
 * @param oldCurrency The old currency, or undefined if not previously set.
 * @param finish A function that, if called, finishes the change immediately.
 * @returns Nothing, or a promise that will be resolved when the app is ready for the new currency.
 */
type CurrencyChangeFunc = (newCurrency: Currency, oldCurrency: Currency | undefined, finish: () => void) => void | Promise<void>;

/**
 * Represents a service that manages currencies.
 */
@autoinject
export class CurrencyService
{
    /**
     * Creates a new instance of the type.
     * @param eventAggregator The `EventAggregator` instance.
     * @param localeService The `LocaleService` instance.
     */
    public constructor(localeService: LocaleService, eventAggregator: EventAggregator)
    {
        this._localeService = localeService;
        this._eventAggregator = eventAggregator;
    }

    private readonly _localeService: LocaleService;
    private readonly _eventAggregator: EventAggregator;
    private _currencies: Currency[];
    private _currency: Currency;
    private _changeFunc: CurrencyChangeFunc;

    /**
     * Gets the supported currencies.
     */
    @computedFrom("_currencies")
    public get currencies(): ReadonlyArray<Currency>
    {
        return this._currencies;
    }

    /**
     * Gets the current currency.
     */
    @computedFrom("_currency")
    public get currency(): Currency
    {
        return this._currency;
    }

    /**
     * Configures the instance.
     * @param currencies The currencies supported by the app.
     * @param changeFunc The function to call before the currency changes.
     */
    public configure(currencies: ICurrency[], changeFunc?: CurrencyChangeFunc): void
    {
        this._currencies = currencies
            .filter(c => c.environments == null || c.environments.includes(ENVIRONMENT.name))
            .map(c => new Currency(c, this._localeService));

        this._changeFunc = changeFunc || (() => undefined);
    }

    /**
     * Gets the currency with the specified currency code.
     * @param currencyCode The case-insensitive currency code.
     * @returns The currency with the specified currency code.
     */
    public getCurrency(currencyCode: string): Currency
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
     * @returns A promise that will be resolved with the `Currency` instance when the new currency is loaded.
     */
    public async setCurrency(currencyCode: string): Promise<Currency>
    {
        const canonicalCurrencyCode = currencyCode.toUpperCase();

        if (this._currency != null && canonicalCurrencyCode === this._currency.code)
        {
            return Promise.resolve(this._currency);
        }

        const currency = this.getCurrency(canonicalCurrencyCode);

        let finished = false;

        const finishFunc = () =>
        {
            this._currency = currency;
            finished = true;
        };

        await this._changeFunc(currency, this._currency, finishFunc);

        if (!finished)
        {
            finishFunc();
        }

        this._eventAggregator.publish("currency-changed");

        signalBindings("currency-changed");

        return this._currency;
    }
}
