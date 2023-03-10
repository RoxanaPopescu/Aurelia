/**
 * The global variable that the Webpack `DefinePlugin` will replace with the serialized environment.
 *
 * Note that the environment exsists in multiple forms, with different use cases:
 *
 * - The global `ENVIRONMENT` variable, which will be replaced with the serialized environment during build.
 *   This variable do not exist at runtime, and should never be used alone, except to initialize the exported
 *   `environment` constant.
 *
 * - The properties of the global `ENVIRONMENT` variable, e.g. `ENVIRONMENT.debug`, which will be replaced
 *   with their values during build. Use those to conditionally include/exclude code based on the environment.
 *
 * - The exported `environment` constant, which is initialized with the serialized environment.
 *   Use this to get an object representation of the environment at runtime.
 */
declare const ENVIRONMENT: IClientEnvironment;

/**
 * Represents the identifiers for the supported client environments.
 * The client environment is that for which the build is compiled.
 */
declare type ClientEnvironmentName = "development" | "preview" | "production";


/**
 * Represents the identifiers for the supported client platforms.
 * The client platform is that for which the build is compiled.
 */
declare type ClientPlatformName = "cloud" | "desktop";

/**
 * Represents the environment for which the build is compiled.
 * Note that this is injected into `index.html`.
 */
declare interface IClientEnvironment
{
    /**
     * The hash identifying the commit associated with the build,
     * or undefined if no commit info is available.
     */
    commit?: string;

    /**
     * The name identifying the environment.
     */
    name: ClientEnvironmentName;

    /**
     * The name identifying the platform.
     */
    platform: ClientPlatformName;

    /**
     * The IETF language tag identifying the locale, excluding any unicode extension.
     * This value is case sensitive and consists of a lower-case ISO 639-1 language code,
     * optionally followed by a lower-case ISO 15924 script code, an upper-case
     * ISO 3166-1 Alpha 2 country code, and a private use subtag, in that order.
     */
    locale: string;

    /**
     * True to enable API response stubs, otherwise false.
     * Recommended in the `development` environment.
     */
    stubs: boolean;

    /**
     * True to enable debugging features, otherwise false.
     * Recommended in the `development` environment.
     */
    debug: boolean;

    /**
     * True to apply optimizations, otherwise false.
     * Recommended in the `production` environment.
     */
    optimize: boolean;

    /**
     * True to enable API obfuscation, otherwise false.
     * Recommended in the `production` environment.
     */
    obfuscate: boolean;

    /**
     * The base URL for the files for the app.
     * When building for the `frontend-cloud` package, this should be the host-relative
     * path on which the files for the app will be hosted, and must end with a `/`.
     * When building for the `frontend-desktop` package, this should be `/`.
     */
    publicPath: string;

    /**
     * The base URL for the app.
     * When building for the `frontend-cloud` package, this should be the host-relative
     * path on which the app will be hosted, and must end with a `/`.
     * When building for the `frontend-desktop` package, this should be `/`.
     */
    appBasePath: string;

    /**
     * The base URL for the API.
     * Note that this is independent of the `appBasePath` and must end with a `/`.
     */
    apiBaseUrl: string;

    /**
     * True to use path-based routing, false to use fragment-based routing.
     * When building for the `frontend-cloud` package, this should be enabled.
     * When building for any other package, this must be disabled.
     */
    pushState: boolean;

    /**
     * The settings to use for integrations, such as logging and analytics.
     */
    integrations:
    {
        /**
         * The settings to use for the Google Maps integration, or undefined to disable the integration.
         */
        googleMaps:
        {
            /**
             * The ID of the account.
             */
            key: string;
        }

        /**
         * The settings to use for the Google Tag Manager integration, or undefined to disable the integration.
         */
        googleTagManager?:
        {
            /**
             * The data layer ID.
             */
            dataLayerId: string;
        }

        /**
         * The settings to use for the Google Analytics integration, or undefined to disable the integration.
         */
        googleAnalytics?:
        {
            /**
             * The ID of the account.
             */
            id: string;
        }

        /**
         * The settings for the Sentry integration, or undefined to disable the integration.
         */
        sentry?:
        {
            /**
             * The DSN for the account.
             */
            dsn: string;

            /**
             * The pattern for the URL of an event, where `{id}` will be replaced with the ID of the event,
             * or undefined if no event links should be presented.
             */
            eventUrlPattern?: string;
        }
    }
}
