import path from "path";
import globs from "globs";
import { environment } from "../../env";
import { IApiClientSettings } from "../../shared/infrastructure";

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
         * The codes identifying the supported locales.
         */
        supportedLocaleCodes: globs.sync(path.resolve(__dirname, "../translations/*.json"))
            .map(fileName => path.basename(fileName, ".json")),

        /**
         * The code identifying the default locale.
         */
        defaultLocaleCode: "en-US",

        /**
         * The base URL to use when fetching public images based on their ID, including a trailing `/`.
         */
        publicImageBaseUrl: environment.name === "production"
            ? "https://filestorageprodmover.blob.core.windows.net/public/"
            : "https://filestoragetestmover.blob.core.windows.net/public/",

        /**
         * Settings related to OAuth.
         */
        oAuth:
        {
            clientSecret: "R4KfRWz66:=?fg2sggwnEWAB]k^iHs3dP3rpmMWN4E@zu#J3*7NiKNk-_i*RdAK6",
            jwksUri: `${environment.apiBaseUrl}identity/.well-known/openid-configuration/jwks?subscription-key=${environment.subscriptionKey}`
        }
    },

    /**
     * Settings for the middleware.
     */
    middleware:
    {
        /**
         * Settings related `authorize-middleware`.
         */
        authorize:
        {
            accessToken:
            {
                issuer: "https://identity-v1-test-mover.azurewebsites.net",
                header: "authorization",
                cookie: "access-token",
                secret: "TODO: Remove - This is my little secret for protecting my resources. Muhahaha!!"
            }
        }
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
        },

        /**
         * Settings related to the API client.
         */
        api:
        {
            defaults:
            {
                keepalive: true,
                headers:
                {
                    // HACK: Needed when calling NOI endpoints.
                    "x-api-key": "moverwebaccess-4Q9BuDEbzcjZfGqa",
                    "x-api-token": "jf1OWVm9Yw4qE3f14wHUMlrSh0J",
                    "x-version": "5.0.0",

                    "Ocp-Apim-Subscription-Key": environment.subscriptionKey,
                    "Api-Version": "v1"
                }
            },
            endpointUrlPattern: `${environment.apiBaseUrl}{path}`,
            noiEndpointUrlPattern: `${environment.noiApiBaseUrl}{path}`,
            endpointSettings:
            {
                "": { version: "v1", obfuscate: false }
            },
            interceptors: []

        } as IApiClientSettings
    }
};
