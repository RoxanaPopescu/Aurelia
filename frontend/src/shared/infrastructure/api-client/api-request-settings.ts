import { MapObject } from "shared/types";

/**
 * Represents the settings to use for an HTTP request.
 */
export interface IApiRequestSettings
{
    /**
     * The headers associated with the request, represented as an object in which
     * the keys are the header names.
     * The default is undefined, or the configured default value.
     */
    headers?: MapObject;

    /**
     * The number of times the request will be retried if it fails due to a transient error.
     * The default is 0, except for `HEAD` and `GET` requests, for which the default is 3,
     * or the configured default value.
     */
    retry?: number;

    /**
     * The delay in milliseconds before each retry attempt, where the last value
     * will be used for any further attempts.
     * The default value is [100, 1000, 3000], or the configured default value.
     */
    retryDelay?: number[];

    /**
     * The mode associated with the request, which is a string indicating whether
     * the request will use CORS, or will be restricted to same-origin URLs.
     * The default is `cors`, or the configured default value.
     */
    mode?: RequestMode;

    /**
     * The cache mode associated with request, which is a string indicating
     * how the the request will interact with the browser cache when fetching.
     * The default is `default`, or the configured default value.
     */
    cache?: RequestCache;

    /**
     * The credentials mode associated with request, which is a string indicating
     * whether credentials will be sent with the request always, never, or only when
     * sent to a same-origin URL.
     * The default is `same-origin`, or the configured default value.
     */
    credentials?: RequestCredentials;

    /**
     * The redirect mode associated with request, which is a string indicating how
     * redirects for the request will be handled during fetching.
     * The default is `follow`, or the configured default value.
     */
    redirect?: RequestRedirect;

    /**
     * The referrer associated with the request, which is the string `no-referrer`,
     * `client`, or a same-origin URL.
     * The default is `client`, or the configured default value.
     */
    referrer?: "no-referrer" | "client" | string;

    /**
     * The referrer policy associated with request. This is used during fetching to
     * compute the value of the referrer header.
     * The default is `no-referrer-when-downgrade`, or the configured default value.
     */
    referrerPolicy?: ReferrerPolicy;

    /**
     * True to treat a response with status code 404 or 410 as valid, false to throw an error.
     * The default is false, or the configured default value.
     */
    optional?: boolean;

    /**
     * True to deserialize the response body before resolving the promise, otherwise false.
     * If you disable this because the response is not expected to be JSON, make sure to
     * also set the `accept` header accordingly.
     * The default is true, or the configured default value.
     */
    deserialize?: boolean;

    /**
     * The JSON reviver function to use when deserializing the body of a response.
     * The default is undefined, or the configured default value.
     */
    /* tslint:disable-next-line: prefer-method-signature */
    jsonReviver?: (key: string, value: any) => any;
}
