// Load and apply patches needed to fix various bugs.
import "shared/patches";

// Configure and start the app.

import { Aurelia, Container, PLATFORM } from "aurelia-framework";
import { Cookies, ApiClient, ResponseStubInterceptor } from "shared/infrastructure";
import { LocaleService, ILocale, CurrencyService, ICurrency } from "shared/localization";
import { ThemeService, ITheme } from "shared/framework";
import { Visitor } from "app/services/visitor";
import { IdentityService } from "app/services/user/identity";
import settings from "resources/settings/settings";

// Legacy Mover services that need to be configured.
import Localization from "shared/src/localization";
import { LoginService } from "shared/src/components/login/service";
import { Profile } from "shared/src/model/profile";

/**
 * The entry point of the app, called by the Aurelia bootstrapper.
 * @param aurelia The `Aurelia` instance.
 */
export async function configure(aurelia: Aurelia): Promise<any>
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
            settings.infrastructure.api.interceptors.push(new ResponseStubInterceptor(stubs));
        }

        // Configure the infrastructure.

        const cookies = aurelia.container.get(Cookies) as Cookies;
        cookies.configure(settings.infrastructure.cookies);

        const apiClient = aurelia.container.get(ApiClient) as ApiClient;
        apiClient.configure(settings.infrastructure.api);

        const localeService = aurelia.container.get(LocaleService) as LocaleService;
        localeService.configure(settings.app.locales, setLocaleCode);
        await localeService.setLocale(getLocaleCode());

        const currencyService = aurelia.container.get(CurrencyService) as CurrencyService;
        currencyService.configure(settings.app.currencies, setCurrencyCode);
        await currencyService.setCurrency(getCurrencyCode());

        const themeService = aurelia.container.get(ThemeService) as ThemeService;
        themeService.configure(settings.app.themes, setThemeName);
        await themeService.setTheme(getThemeName());

        // Import the base styles and theme.
        await import("resources/styles/index.scss" as any);
        await import(`resources/themes/${getThemeName()}/styles/index.scss`);

        // Import the icons in the icons folder.
        await import("resources/icons");

        // Attempt to reauthenticate using a token stored on the device.
        const identityService = aurelia.container.get(IdentityService) as IdentityService;
        await identityService.reauthenticate();

        // Configure legacy Mover services.
        Localization.configure(localeService.locale.code, localeService.locale.code);
        const loginResponse = await LoginService.login("Fulfiller", "connie@cooplogistik.dk", "mover1234!");
        await Profile.login(loginResponse.accessToken, loginResponse.refreshToken);
    });

    // Start the framework.
    await aurelia.start();

    // Set the root module and compose the app.
    await aurelia.setRoot(PLATFORM.moduleName("app/app"));
}

/**
 * Gets the name of the theme to use, or the default.
 * @return The name of the theme to use.
 */
function getThemeName(): string
{
    let theme: string | undefined;

    // Try to get the theme from the URL.
    // This is intended as an override to be used for testing.

    const url = new URL(location.href);
    theme = url.searchParams.get("theme") || undefined;

    if (theme)
    {
        return theme;
    }

    // Try to get the theme from the cookie.
    // This should be set by the server based on the domain,
    // or by the client if the theme is changed by the user.

    const cookies = Container.instance.get(Cookies) as Cookies;
    theme = cookies.get("theme");

    if (theme)
    {
        return theme;
    }

    // If no theme was specified, use the default.

    return "default";
}

/**
 * Called when the theme changes.
 * This stores the theme slug in a cookie and reloads the app.
 * @param newTheme The new theme being set.
 * @param oldTheme The old theme, or undefined if not previously set.
 * @returns A promise that never resolves, as the page is about to reload.
 */
async function setThemeName(newTheme: ITheme, oldTheme: ITheme): Promise<void>
{
    if (oldTheme != null)
    {
        const cookies = Container.instance.get(Cookies) as Cookies;

        cookies.set("theme", newTheme.slug);

        location.reload();

        return new Promise(() => undefined);
    }
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
 * Called when the locale changes, and reloads the app for the new locale.
 * @param newLocale The new locale being set.
 * @param oldLocale The old locale, or undefined if not previously set.
 * @returns A promise that never resolves, as the page is about to reload.
 */
async function setLocaleCode(newLocale: ILocale, oldLocale: ILocale): Promise<void>
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
 * Gets the currency code stored on the device, or the default.
 * @return The currency code to use.
 */
function getCurrencyCode(): string
{
    const cookies = Container.instance.get(Cookies) as Cookies;

    return cookies.get("currency") || "DKK";
}

/**
 * Called when the currency changes, and stores the currency code on the device.
 * @param newCurrency The new currency being set.
 * @param oldCurrency The old currency, or undefined if not previously set.
 */
function setCurrencyCode(newCurrency: ICurrency, oldCurrency: ICurrency): void
{
    if (oldCurrency != null)
    {
        const cookies = Container.instance.get(Cookies) as Cookies;

        cookies.set("currency", newCurrency.code);
    }
}
