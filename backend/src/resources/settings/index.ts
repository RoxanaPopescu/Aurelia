import { environment } from "../../env";
import { IApiClientSettings } from "../../shared/infrastructure";

/**
 * Represents the settings related to infrastructure, framework and environment.
 */
export default
{
    /**
     * Settings for the infrastructure.
     */
    infrastructure:
    {
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
