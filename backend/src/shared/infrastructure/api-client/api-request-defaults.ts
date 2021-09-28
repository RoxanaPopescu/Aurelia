import { IApiRequestOptions } from "./api-request-options";

/**
 * The default settings to use as fallback.
 */
export const apiRequestDefaults: IApiRequestOptions =
{
    headers:
    {
        "accept": "application/json",
        "content-type": "application/json"
    },
    retry: 3,
    retryDelay: [100, 1000, 3000],
    redirect: "follow",
    keepalive: false,
    optional: false,
    deserialize: true,
    highWaterMark: 1000000,
    jsonReviver: undefined,
    noi: false
};
