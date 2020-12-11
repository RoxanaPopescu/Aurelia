// Load and apply patches needed to fix various bugs.
import "shared/patches";

// Load and apply polyfills.
import "inert-polyfill";

// Configure and start the app.

import { PLATFORM, Aurelia, Container, LogManager } from "aurelia-framework";
import { Settings as LuxonSettings } from "luxon";
import { LogAppender, Cookies, ApiClient, ResponseStubInterceptor, Log, setPrerenderStatusCode } from "shared/infrastructure";
import { LocaleService, Locale, CurrencyService, Currency } from "shared/localization";
import { ThemeService, ITheme } from "shared/framework";
import { Visitor } from "app/services/visitor";
import { IdentityService, Identity } from "app/services/identity";
import settings from "resources/settings";

// Legacy Mover services that need to be configured.
import Localization from "shared/src/localization";

/**
 * The entry point of the app, called by the Aurelia bootstrapper.
 * @param aurelia The `Aurelia` instance.
 */
export async function configure(aurelia: Aurelia): Promise<void>
{
    console.group("Configuration");

    // Configure cookies.
    const cookies = aurelia.container.get(Cookies);
    cookies.configure(settings.infrastructure.cookies);

    // Create the visitor.
    const visitor = aurelia.container.get(Visitor);

    // Attach the visitor info to log entries.
    Log.setTags({ visitor: visitor.visitorId, session: visitor.sessionId });

    // Configure the log manager.
    LogManager.addAppender(new LogAppender());
    LogManager.setLevel(ENVIRONMENT.debug ? LogManager.logLevel.debug : LogManager.logLevel.warn);

    // Configure the framework.
    aurelia.use
        .standardConfiguration();

    // Add plugins.
    aurelia.use
        .plugin(PLATFORM.moduleName("aurelia-animator-css"));

    // Add features.
    aurelia.use
        .feature(PLATFORM.moduleName("shared/infrastructure/index"))
        .feature(PLATFORM.moduleName("shared/localization/index"))
        .feature(PLATFORM.moduleName("shared/framework/index"));

    // Register global resources.
    aurelia.use.globalResources(
    [
        PLATFORM.moduleName("app/components/if-environment/if-environment"),
        PLATFORM.moduleName("app/components/if-claims/if-claims"),
        PLATFORM.moduleName("app/components/info-icon/info-icon")
    ]);

    // Add task that will run after all plugins and features have been loaded.
    aurelia.use.postTask(async () =>
    {
        // Load and use response stubs, if enabled.
        if (ENVIRONMENT.stubs)
        {
            const { stubs } = await import(/* webpackChunkName: "stubs" */"resources/stubs");
            settings.infrastructure.api.interceptors.push(new ResponseStubInterceptor(stubs, 20));
        }

        // Configure features.

        const apiClient = aurelia.container.get(ApiClient);
        apiClient.configure(settings.infrastructure.api);

        const localeService = aurelia.container.get(LocaleService);
        localeService.configure(settings.app.locales, setLocale);
        await localeService.setLocale(getLocaleCode());

        const currencyService = aurelia.container.get(CurrencyService);
        currencyService.configure(settings.app.currencies, setCurrency);
        await currencyService.setCurrency(getCurrencyCode());

        const themeService = aurelia.container.get(ThemeService);
        themeService.configure(settings.app.themes, setTheme);
        await themeService.setTheme(getThemeSlug());

        // Configure legacy features.

        Localization.configure(localeService.locale.code, localeService.locale.code);

        // Execute network requests concurrently.
        await Promise.all(
        [
            async () =>
            {
                // Import style resources.
                await import(/* webpackChunkName: "styles" */"resources/styles/index.scss" as any);
                await import(/* webpackChunkName: "theme-" */`resources/themes/${themeService.theme.slug}/styles/index.scss`);
            },
            async () =>
            {
                // Import icon resources.
                await import(/* webpackChunkName: "icons" */"resources/icons");
            },
            async () =>
            {
                // Attempt to reauthenticate using a token stored on the device.
                const identityService = aurelia.container.get(IdentityService);
                identityService.configure(setIdentity);
                await identityService.reauthenticate();
            }
        ]
        .map(f => f()));
    });

    // Start the framework.
    await aurelia.start();

    console.info("Configuration completed");
    console.groupEnd();

    // Set the root component and compose the app.
    await aurelia.setRoot(PLATFORM.moduleName("app/app"));

    // TODO: The value we set here should depend on whether the page actually rendered successfully.
    // Set the status code that should be returned to crawlers.
    setPrerenderStatusCode(200);
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
async function setLocale(newLocale: Locale, oldLocale: Locale): Promise<void>
{
    // If this is a user-initiated change, set the `locale` cookie and reload the app.
    if (oldLocale != null)
    {
        const cookies = Container.instance.get(Cookies);

        cookies.set("locale", newLocale.code);

        location.reload();

        // The app is reloading, so return a promise that will never be resolved.
        return new Promise(() => undefined);
    }

    // Set the default locale to use for the `luxon` package.
    LuxonSettings.defaultLocale = newLocale.code;

    // Set the `locale` header to use for the `ApiClient`.
    // tslint:disable-next-line: no-string-literal
    settings.infrastructure.api.defaults!.headers!["x-locale"] = newLocale.code;
}

/**
 * Gets the code identifying the currency to use, or the default.
 * This may be stored on the device or specified using the `currency` query parameter.
 * @return The code identifying the currency to use.
 */
function getCurrencyCode(): string
{
    const url = new URL(location.href);
    const cookies = Container.instance.get(Cookies);

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
        const currencyService = Container.instance.get(CurrencyService);

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
function setCurrency(newCurrency: Currency, oldCurrency: Currency): void
{
    // If this is a user-initiated change, set the `currency` cookie.
    if (oldCurrency != null)
    {
        const cookies = Container.instance.get(Cookies);

        cookies.set("currency", newCurrency.code);
    }

    // Set the `currency` header to use for the `ApiClient`.
    // tslint:disable-next-line: no-string-literal
    settings.infrastructure.api.defaults!.headers!["x-currency"] = newCurrency.code;
}

/**
 * Gets the slug identifying the theme to use, or the default.
 * This may be stored on the device or specified using the `theme` query parameter.
 * @return The slug identigying the theme to use.
 */
function getThemeSlug(): string
{
    const url = new URL(location.href);
    const cookies = Container.instance.get(Cookies);

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
        const themeService = Container.instance.get(ThemeService);

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
async function setTheme(newTheme: ITheme, oldTheme: ITheme | undefined): Promise<void>
{
    // If this is a user-initiated change, set the `theme` cookie and reload the app.
    if (oldTheme != null)
    {
        const cookies = Container.instance.get(Cookies);

        cookies.set("theme", newTheme.slug);

        location.reload();

        // The app is reloading, so return a promise that will never be resolved.
        return new Promise(() => undefined);
    }
}

/**
 * Called when the identity changes.
 * @param newIdentity The new identity that was authenticated, if any.
 * @param oldIdentity The old identity that was unauthenticated, if any.
 */
function setIdentity(newIdentity: Identity | undefined, oldIdentity: Identity | undefined): void
{
    if (newIdentity != null)
    {
        // Set the user associated with log entries.
        Log.setUser(newIdentity);
    }
    else
    {
        // Reset the user associated with log entries.
        Log.setUser(undefined);
    }
}
