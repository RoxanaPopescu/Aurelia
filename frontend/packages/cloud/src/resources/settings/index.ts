import { Duration } from "luxon";
import { environment } from "../../env";

/**
 * Represents the settings for the app.
 */
export default
{
    /**
     * Settings for the app.
     */
    app:
    {
        /**
         * The locale code for the localized build to serve, if not specified in the request.
         */
        defaultLocaleCode: "en-US",

        /**
         * The secret debug token, which if present in the `x-debug-token` header,
         * enables serving of otherwise protected content, such as source maps.
         */
        debugToken: "not-to-be-shared",

        /**
         * The max-age to set when serving responses.
         */
        maxAge:
        {
            /**
             * The `index.html` file is unversioned and produced during build.
             * We should not cache this, as it changes in each release and depends
             * on the locale chosen by the user, which may be specified as a cookie.
             */
            index: Duration.fromISO("PT0S"),

            /**
             * Artifacts are versioned bundles and unversioned resources produced during build.
             * We should cache them for a while, as resources rarely change and are unlikely to
             * break things if outdated - if they would break things, they can just be renamed.
             */
            artifact:
            {
                "production": Duration.fromISO("P7D"),
                "preview": Duration.fromISO("PT5M"),
                "development": Duration.fromISO("PT0S")

            }[environment.name],

            /**
             * Static files are unversioned files that are not produced by the build process.
             * We should not cache them for long, as we may need to update them.
             */
            static:
            {
                "production": Duration.fromISO("PT5M"),
                "preview": Duration.fromISO("PT0S"),
                "development": Duration.fromISO("PT0S")

            }[environment.name]
        }
    },

    /**
     * Settings for the `prerender-node` middleware.
     * See: https://prerender.io/documentation
     */
    prerender:
    {
        serviceToken: undefined,
        serviceUrl: undefined
    },

    /**
     * The settings for the hostnames supported by the app.
     * Note that matching is done from top to bottom.
     */
    hosts:
    [
        {
            hostname: /(^|\.)movertransport.com$/,
            localeCode: "en-US",
            currencyCode: "DKK",
            themeSlug: "mover"
        },
        {
            hostname: /(^|\.)cooplogistikonline.dk$/,
            localeCode: "da",
            currencyCode: "DKK",
            themeSlug: "coop"
        },
        {
            hostname: /(^|\.)ikea\.(dk|com|ch|nl)$/,
            localeCode: "en-US",
            currencyCode: "DKK",
            themeSlug: "ikea"
        },
        {
            hostname: /(^|\.)ikea.moversystems.com$/,
            localeCode: "en-US",
            currencyCode: "DKK",
            themeSlug: "ikea"
        },
        {
            hostname: /(^|\.)ikea.mover.dev$/,
            localeCode: "en-US",
            currencyCode: "DKK",
            themeSlug: "ikea"
        },
        {
            hostname: /(^|\.)tms.interflora.dk$/,
            localeCode: "da",
            currencyCode: "DKK",
            themeSlug: "interflora"
        },
        {
            hostname: /./,
            localeCode: "en-US",
            currencyCode: "DKK",
            themeSlug: "mover"
        }
    ]
};
