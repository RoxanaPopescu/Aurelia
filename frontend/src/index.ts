// Load and apply patches needed to fix various bugs.
import "shared/patches";

// Load and apply polyfills.
import "inert-polyfill";

// Configure and start the app.

import { Aurelia, Container, PLATFORM } from "aurelia-framework";
import { Cookies, ApiClient, ResponseStubInterceptor } from "shared/infrastructure";
import { LocaleService, ILocale, CurrencyService, ICurrency } from "shared/localization";
import { ThemeService, ITheme } from "shared/framework";
import { Visitor } from "app/services/visitor";
import { IdentityService } from "app/services/identity";
import settings from "resources/settings";

// Legacy Mover services that need to be configured.
import Localization from "shared/src/localization";

/**
 * The entry point of the app, called by the Aurelia bootstrapper.
 * @param aurelia The `Aurelia` instance.
 */
export async function configure(aurelia: Aurelia): Promise<void>
{
    // Create the visitor.
    aurelia.container.get(Visitor);

    // Configure the framework.
    aurelia.use
        .standardConfiguration()
        .developmentLogging(ENVIRONMENT.debug ? "debug" : "warn");

    // Add plugins.
    aurelia.use
        .plugin(PLATFORM.moduleName("aurelia-animator-css"));

    // Add features.
    aurelia.use
        .feature(PLATFORM.moduleName("shared/infrastructure/index"))
        .feature(PLATFORM.moduleName("shared/localization/index"))
        .feature(PLATFORM.moduleName("shared/framework/index"));

    // Add task that will run after all plugins and features have been loaded.
    aurelia.use.postTask(async () =>
    {
        // Load and use response stubs, if enabled.
        if (ENVIRONMENT.stubs)
        {
            const { stubs } = await import("resources/stubs");
            settings.infrastructure.api.interceptors.push(new ResponseStubInterceptor(stubs, 20));
        }

        // Configure features.

        const cookies = aurelia.container.get(Cookies) as Cookies;
        cookies.configure(settings.infrastructure.cookies);

        const apiClient = aurelia.container.get(ApiClient) as ApiClient;
        apiClient.configure(settings.infrastructure.api);

        const localeService = aurelia.container.get(LocaleService) as LocaleService;
        localeService.configure(settings.app.locales, setLocale);
        await localeService.setLocale(getLocaleCode());

        const currencyService = aurelia.container.get(CurrencyService) as CurrencyService;
        currencyService.configure(settings.app.currencies, setCurrency);
        await currencyService.setCurrency(getCurrencyCode());

        const themeService = aurelia.container.get(ThemeService) as ThemeService;
        themeService.configure(settings.app.themes, setTheme);
        await themeService.setTheme(getThemeSlug());

        // Configure legacy features.

        Localization.configure(localeService.locale.code, localeService.locale.code);

        // Import style resources.
        await import("resources/styles/index.scss" as any);
        await import(`resources/themes/${themeService.theme.slug}/styles/index.scss`);

        // Import icon resources.
        await import("resources/icons");

        // Attempt to reauthenticate using a token stored on the device.
        const identityService = aurelia.container.get(IdentityService) as IdentityService;
        await identityService.reauthenticate();
    });

    // Start the framework.
    await aurelia.start();

    // Set the root component and compose the app.
    await aurelia.setRoot(PLATFORM.moduleName("app/app"));
}

/**
 * Gets the locale code stored on the device, or the default.
 * @return The locale code to use.
 */
function getLocaleCode(): string
{
    return ENVIRONMENT.locale;
}

/**
 * Called when the locale changes.
 * This stores the locale code in a cookie and reloads the app.
 * @param newLocale The new locale being set.
 * @param oldLocale The old locale, or undefined if not previously set.
 * @returns A promise that never resolves, as the page is about to reload.
 */
async function setLocale(newLocale: ILocale, oldLocale: ILocale): Promise<void>
{
    if (oldLocale != null)
    {
        const cookies = Container.instance.get(Cookies) as Cookies;

        cookies.set("locale", newLocale.code);

        location.reload();

        return new Promise(() => undefined);
    }
}

/**
 * Gets the code identifying the currency to use, or the default.
 * This may be stored on the device or specified using the `currency` query parameter.
 * @return The code identifying the currency to use.
 */
function getCurrencyCode(): string
{
    const url = new URL(location.href);
    const cookies = Container.instance.get(Cookies) as Cookies;

    // Try to get the currency from the URL.
    // This is intended as an override to be used for testing.
    let currencyCode = url.searchParams.get("currency") || undefined;

    // Try to get the currency from the cookie.
    // This should be set by the server based on the domain,
    // or by the client if the currency is changed by the user.
    if (!currencyCode)
    {
        currencyCode = cookies.get("currency");
    }

    // If a currency was specified, verify that it exists.
    if (currencyCode)
    {
        const currencyService = Container.instance.get(CurrencyService) as CurrencyService;

        try
        {
            currencyService.getCurrency(currencyCode);
        }
        catch
        {
            console.warn(`The currency '${currencyCode}' is not supported.`);
            currencyCode = undefined;
        }
    }

    // Return the slug identifying the specified currency, or the default.
    return currencyCode || settings.app.defaultCurrencyCode;
}

/**
 * Called when the currency changes.
 * This stores the currency code in a cookie.
 * @param newCurrency The new currency being set.
 * @param oldCurrency The old currency, or undefined if not previously set.
 */
function setCurrency(newCurrency: ICurrency, oldCurrency: ICurrency): void
{
    if (oldCurrency != null)
    {
        const cookies = Container.instance.get(Cookies) as Cookies;

        cookies.set("currency", newCurrency.code);
    }
}

/**
 * Gets the slug identifying the theme to use, or the default.
 * This may be stored on the device or specified using the `theme` query parameter.
 * @return The slug identigying the theme to use.
 */
function getThemeSlug(): string
{
    const url = new URL(location.href);
    const cookies = Container.instance.get(Cookies) as Cookies;

    // Try to get the theme from the URL.
    // This is intended as an override to be used for testing.
    let themeSlug = url.searchParams.get("theme") || undefined;

    // Try to get the theme from the cookie.
    // This should be set by the server based on the domain,
    // or by the client if the theme is changed by the user.
    if (!themeSlug)
    {
        themeSlug = cookies.get("theme");
    }

    // If a theme was specified, verify that it exists.
    if (themeSlug)
    {
        const themeService = Container.instance.get(ThemeService) as ThemeService;

        try
        {
            themeService.getTheme(themeSlug);
        }
        catch
        {
            console.warn(`The theme '${themeSlug}' is not supported.`);
            themeSlug = undefined;
        }
    }

    // Return the slug identifying the specified theme, or the default.
    return themeSlug || settings.app.defaultThemeSlug;
}

/**
 * Called when the theme changes.
 * If the theme was changed, this stores the theme slug in a cookie and reloads the app.
 * @param newTheme The new theme being set.
 * @param oldTheme The old theme, or undefined if not previously set.
 * @returns A promise that never resolves, as the page is about to reload.
 */
async function setTheme(newTheme: ITheme, oldTheme: ITheme): Promise<void>
{
    if (oldTheme != null)
    {
        const cookies = Container.instance.get(Cookies) as Cookies;

        cookies.set("theme", newTheme.slug);

        location.reload();

        return new Promise(() => undefined);
    }
}
