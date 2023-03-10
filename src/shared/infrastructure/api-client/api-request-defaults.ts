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
    mode: "cors",
    cache: "default",
    credentials: "same-origin",
    redirect: "follow",
    referrer: "client",
    referrerPolicy: "no-referrer-when-downgrade",
    optional: false,
    deserialize: true,
    jsonReviver: undefined,
    keepalive: false
};
