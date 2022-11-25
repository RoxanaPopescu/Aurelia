import { IApiClientSettings, ICookieOptions, CorrelationHeaderInterceptor } from "shared/infrastructure";
import { IGoogleMapsSettings } from "shared/google-maps";
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
        defaultThemeSlug: "mover-blue",

        /**
         * The code identifying the default currency.
         */
        defaultCurrencyCode: "DKK",

        /**
         * The time in milliseconds before a toast, by default, disappears.
         */
        defaultToastTimeout: 10000,

        /**
         * Settings for the notifications module.
         */
        notifications:
        {
            /**
             * The interval in milliseconds between requests for new notifications.
             */
            refreshInterval: 30000,

            /**
             * The max number of notifications to fetch in each request.
             */
            pageSize: 300,

            /**
             * The time in milliseconds before a toast notification disappears.
             */
            toastTimeout: 10000
        },

        /**
         * The base URL to use when fetching public images based on their ID,
         * including a trailing `/`.
         */
        publicImageBaseUrl: ENVIRONMENT.name === "production"
            ? "https://filestorageprodmover.blob.core.windows.net/public/"
            : "https://filestoragetestmover.blob.core.windows.net/public/"
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
            endpointUrlPattern: `${ENVIRONMENT.apiBaseUrl}v{version}/{path}`,
            endpointSettings:
            {
                "": { version: "2", obfuscate: false }
            },
            defaults:
            {
                headers:
                {
                    "x-api-key": "a89ba961-1a7d-4a1e-953c-0c8a766979ae"
                }
            },
            interceptors:
            [
                new CorrelationHeaderInterceptor("x-correlation")
            ],
            cipher: ENVIRONMENT.obfuscate
                ? "svrmZIDJCKab+o8n-h7wTR6l4XO1Qz95PHMp3BFNiqeYGdEAUx0_SckLVufy2jtgW"
                : undefined

        } as IApiClientSettings
    },

    /**
     * Settings related to integrations.
     */
    integrations:
    {
        /**
         * Settings related to the Google Maps integration.
         */
        googleMaps:
        {
            parameters:
            {
                key: ENVIRONMENT.integrations.googleMaps.key,
                language: ENVIRONMENT.locale,
                libraries: ["drawing", "geometry"],

                // HACK: The version is locked, as newer versions crash the browser.
                // The crash appears to occur the second time a map containing a polyline or polygon is created,
                // and the bug appears to be related to the use of a `mapId`. An alternative workaround may be
                // to stop using a `mapId`, and revert to using hardcoded style objects instead.
                // However, this is an untested hypothesis.
                v: "3.47",

                // Note: This will be set when the theme loads.
                mapIds: undefined
            },
            defaults:
            {
                center: { lat: 55.691, lng: 12.567 },
                zoom: 4,
                controlSize: 40,
                gestureHandling: "greedy",
                fullscreenControl: false,
                minZoom: 2,
                scrollwheel: false,
                clickableIcons: false,
                restriction:
                {
                    latLngBounds: { north: 85, south: -85, west: -180, east: 180 }
                },
                mapTypeControlOptions:
                {
                    position: 3
                },

                // Note: This will be set when the theme loads.
                mapId: undefined
            }

        } as IGoogleMapsSettings,

        /**
         * Settings related to the legacy Google Maps integration.
         */
        legacyGoogleMaps:
        {
            // Note: This will be set when the theme loads, if supported by the theme.
            mapStyleName: undefined

        } as { mapStyleName: "roadmap-light" | "roadmap-dark" | undefined}
    }
};
