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
                issuer: "mover",
                audience: "mover",
                header: "x-refresh-token",
                cookie: "refresh-token",
                expiresIn: Duration.fromObject({ days: 30 }),
                secret: "Qknf3Wb2SP4C5qp4mubS5MNjTg9sNdhH"
            },
            accessToken:
            {
                issuer: "mover",
                audience: "mover",
                header: "x-access-token",
                cookie: "access-token",
                expiresIn: Duration.fromObject({ days: 3 }),
                secret: "Qknf3Wb2SP4C5qp4mubS5MNjTg9sNdhH"
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
                headers:
                {
                    "x-api-key": "a89ba961-1a7d-4a1e-953c-0c8a766979ae"
                }
            },
            cipher: "svrmZIDJCKab+o8n-h7wTR6l4XO1Qz95PHMp3BFNiqeYGdEAUx0_SckLVufy2jtgW",
            endpointUrlPattern: `${environment.apiBaseUrl}{path}`,
            endpointSettings:
            {
                "": { version: "1", obfuscate: false }
            },
            interceptors: []

        } as IApiClientSettings
    }
};
