import { autoinject, computedFrom } from "aurelia-framework";
import { ILocale } from "./locale";

/**
 * Represents a function that will be called before the locale changes.
 * Use this to preparing the app for the new locale.
 * @param newLocale The new locale being set.
 * @param oldLocale The old locale, or undefined if not previously set.
 * @returns Nothing, or a promise that will be resolved when the app is ready for the new locale.
 */
type LocaleChangeFunc = (newLocale: ILocale | undefined, oldLocale: ILocale) => void | Promise<void>;

/**
 * Represents a service that manages locales.
 */
@autoinject
export class LocaleService
{
    private _locales: ILocale[];
    private _locale: ILocale;
    private _changeFunc: LocaleChangeFunc;

    /**
     * Gets the supported locales.
     */
    @computedFrom("_locales")
    public get locales(): ReadonlyArray<ILocale>
    {
        return this._locales;
    }

    /**
     * Gets the current locale.
     */
    @computedFrom("_locale")
    public get locale(): ILocale
    {
        return this._locale;
    }

    /**
     * Configures the instance.
     * @param locales The locales supported by the app.
     * @param changeFunc The function that is invoked when setting the locale.
     */
    public configure(locales: ILocale[], changeFunc?: LocaleChangeFunc): void
    {
        this._locales = locales;
        this._changeFunc = changeFunc || (() => undefined);
    }

    /**
     * Gets the locale with the specified locale code.
     * @param localeCode The case-insensitive locale code.
     * @returns The locale with the specified locale code.
     */
    public getLocale(localeCode: string): ILocale
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
     * @returns A promise that will be resolved with the `ILocale` instance when the new locale is loaded.
     */
    public async setLocale(localeCode: string): Promise<ILocale>
    {
        if (this._locale != null && localeCode === this._locale.code)
        {
            return Promise.resolve(this._locale);
        }

        const locale = this.getLocale(localeCode);

        await this._changeFunc(locale, this._locale);

        this._locale = locale;

        return this._locale;
    }
}
