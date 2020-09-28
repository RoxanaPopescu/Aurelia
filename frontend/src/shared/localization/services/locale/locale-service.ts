import { autoinject, computedFrom, signalBindings } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { ILocale, Locale } from "./locale";

/**
 * Represents a function that will be invoked before the locale changes.
 * Use this to prepare the app for the new locale.
 * @param newLocale The new locale being set.
 * @param oldLocale The old locale, or undefined if not previously set.
 * @returns Nothing, or a promise that will be resolved when the app is ready for the new locale.
 */
type LocaleChangeFunc = (newLocale: Locale, oldLocale: Locale | undefined) => void | Promise<void>;

/**
 * Represents a service that manages locales.
 */
@autoinject
export class LocaleService
{
    /**
     * Creates a new instance of the type.
     * @param eventAggregator The `EventAggregator` instance.
     */
    public constructor(eventAggregator: EventAggregator)
    {
        this._eventAggregator = eventAggregator;
    }

    private readonly _eventAggregator: EventAggregator;
    private _locales: Locale[];
    private _locale: Locale;
    private _changeFunc: LocaleChangeFunc;

    /**
     * Gets the supported locales.
     */
    @computedFrom("_locales")
    public get locales(): ReadonlyArray<Locale>
    {
        return this._locales;
    }

    /**
     * Gets the current locale.
     */
    @computedFrom("_locale")
    public get locale(): Locale
    {
        return this._locale;
    }

    /**
     * Configures the instance.
     * @param locales The locales supported by the app.
     * @param changeFunc The function that is invoked before the locale changes.
     */
    public configure(locales: ILocale[], changeFunc?: LocaleChangeFunc): void
    {
        this._locales = locales.filter(l => ENVIRONMENT.debug || !l.debug).map(l => new Locale(l));
        this._changeFunc = changeFunc || (() => undefined);
    }

    /**
     * Gets the locale with the specified locale code.
     * @param localeCode The case-insensitive locale code.
     * @returns The locale with the specified locale code.
     */
    public getLocale(localeCode: string): Locale
    {
        const canonicalLocaleCode = Intl.getCanonicalLocales([localeCode])[0];
        const locale = this._locales.find(l => l.code === canonicalLocaleCode);

        if (locale == null)
        {
            throw new Error(`The locale '${canonicalLocaleCode}' is not supported.`);
        }

        return locale;
    }

    /**
     * Sets the current locale.
     * @param localeCode The new case-insensitive locale code.
     * @returns A promise that will be resolved with the `Locale` instance when the new locale is loaded.
     */
    public async setLocale(localeCode: string): Promise<Locale>
    {
        const canonicalLocaleCode = Intl.getCanonicalLocales([localeCode])[0];

        if (this._locale != null && canonicalLocaleCode === this._locale.code)
        {
            return Promise.resolve(this._locale);
        }

        const locale = this.getLocale(canonicalLocaleCode);

        await this._changeFunc(locale, this._locale);

        this._locale = locale;

        this._eventAggregator.publish("locale-changed");

        signalBindings("locale-changed");

        return this._locale;
    }
}
