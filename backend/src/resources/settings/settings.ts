import path from "path";
import globs from "globs";
import { environment } from "../../env";
import { IApiClientSettings } from "../../shared/infrastructure";
import { Duration } from "luxon";

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
        defaultLocaleCode: "en-US"
    },

    /**
     * Settings for the middleware.
     */
    middleware:
    {
        /**
         * Settings related to identity.
         */
        identity:
        {
            accessToken:
            {
                issuer: "Mover Systems Aps",
                audience: undefined,
                header: "authorization",
                cookie: "access-token",
                expiresIn: Duration.fromObject({ days: 7 }),
                secret: "This is my little secret for protecting my resources. Muhahaha!!"
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
         * FIXME: Support header versioning
         */
        api:
        {
            defaults:
            {
                headers:
                {
                    // HACK: Needed when calling NOI endpoints.
                    "x-api-key": "moverwebaccess-4Q9BuDEbzcjZfGqa",
                    "x-version": "5.0.0",

                    "Ocp-Apim-Subscription-Key": environment.subscriptionKey,
                    "Api-Version": "v1"
                }
            },
            obfuscate: false,
            cipher: "svrmZIDJCKab+o8n-h7wTR6l4XO1Qz95PHMp3BFNiqeYGdEAUx0_SckLVufy2jtgW",
            endpointUrlPattern: `${environment.apiBaseUrl}{path}`,
            endpointSettings:
            {
                "": { version: "v1", obfuscate: false }
            },
            interceptors: []

        } as IApiClientSettings
    }
};
