import { environment } from "../../env";
import { IApiClientSettings } from "../../shared/infrastructure";
import { Duration } from "luxon";

/**
 * Represents the settings related to infrastructure, framework and environment.
 */
export default
{
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
            refreshToken:
            {
                issuer: "Mover Systems Aps",
                audience: undefined,
                header: "refresh-token",
                cookie: "refresh-token",
                expiresIn: Duration.fromObject({ days: 60 }),
                secret: "This is my little secret for protecting my resources. Muhahaha!!"
            },
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
                    "Ocp-Apim-Subscription-Key": environment.subscriptionKey,
                    "Api-Version": "v1"
                }
            },
            cipher: "svrmZIDJCKab+o8n-h7wTR6l4XO1Qz95PHMp3BFNiqeYGdEAUx0_SckLVufy2jtgW",
            endpointUrlPattern: `${environment.apiBaseUrl}{path}`,
            endpointSettings:
            {
                "": { version: "", obfuscate: false }
            },
            interceptors: []

        } as IApiClientSettings
    }
};
