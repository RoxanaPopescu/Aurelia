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
         * The max-age in seconds to set when serving files in production.
         */
        maxAge:
        {
            /**
             * The 'index.html' file is unversioned and produced during build.
             * We should not cache this, as it changes in each release and depends
             * on the locale chosen by the user, which is specified as a cookie.
             */
            index: 0, // Do not cache

            /**
             * Artifacts are versioned bundles and unversioned resources produced during build.
             * We should cache them for a while, as resources rarely change and are unlikely to
             * break things if outdated - and if they do, we can renaming them.
             */
            artifact: 7 * 24 * 60 * 60, // 7 days

            /**
             * Static files are unversioned files that are not produced by the build process.
             * We should not cache them for long, as we may need to update them.
             */
            static: 5 * 60 // 5 minutes
        }
    },

    /**
     * The settings for the hostnames supported by the app.
     * Note that matching is done from top to bottom.
     */
    hosts:
    [
        { hostname: /(^|\.)movertransport.com$/, localeCode: "da", currencyCode: "DKK", themeSlug: "mover" },
        { hostname: /(^|\.)cooplogistikonline\.dk$/, localeCode: "da", currencyCode: "DKK", themeSlug: "coop" },
        { hostname: /./, localeCode: "da", currencyCode: "DKK", themeSlug: "mover" }
    ]
};
