import { IApiClientSettings, ICookieOptions, CorrelationHeaderInterceptor } from "shared/infrastructure";
import locales from "./locales.json";
import currencies from "./currencies.json";
import themes from "./themes.json";

/**
 * Represents the settings related to infrastructure, framework and environment.
 */
export default
{
    /**
     * Settings for the app.
     */
    app:
    {
        /**
         * The locales supported by the app.
         */
        locales,

        /**
         * The currencies supported by the app.
         */
        currencies,

        /**
         * The themes supported by the app.
         */
        themes,

        /**
         * The slug identifying the default theme.
         */
        defaultThemeSlug: "mover",

        /**
         * The code identifying the default currency.
         */
        defaultCurrencyCode: "DKK",

        /**
         * The time in milliseconds before a toast, by default, disappears.
         */
        defaultToastTimeout: 10000
    },

    /**
     * Settings for the infrastructure.
     */
    infrastructure:
    {
        /**
         * Settings related to cookies.
         */
        cookies:
        {
            path: "/"

        } as ICookieOptions,

        /**
         * Settings related to the API client.
         */
        api:
        {
            defaults:
            {
                headers:
                {
                    "x-api-key": "a89ba961-1a7d-4a1e-953c-0c8a766979ae"
                }
            },
            cipher: "svrmZIDJCKab+o8n-h7wTR6l4XO1Qz95PHMp3BFNiqeYGdEAUx0_SckLVufy2jtgW",
            obfuscate: ENVIRONMENT.obfuscate,
            endpointUrlPattern: `${ENVIRONMENT.apiBaseUrl}v{version}/{path}`,
            endpointSettings:
            {
                "distribution-center": { version: "2", obfuscate: false },
                "routes/templates": { version: "2", obfuscate: false },
                "": { version: "1", obfuscate: false }
            },
            interceptors:
            [
                new CorrelationHeaderInterceptor("x-correlation")
            ]

        } as IApiClientSettings
    }
};
