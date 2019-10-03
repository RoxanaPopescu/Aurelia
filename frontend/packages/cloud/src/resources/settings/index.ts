/**
 * Represents the settings for the app, infrastructure, and framework.
 */
export default
{
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
