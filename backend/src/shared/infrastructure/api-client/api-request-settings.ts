import { RequestRedirect } from "node-fetch";
import { MapObject } from "../../types";

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
     * The redirect mode associated with request, which is a string indicating how
     * redirects for the request will be handled during fetching.
     * The default is `follow`, or the configured default value.
     */
    redirect?: RequestRedirect;

    /**
     * True to keep sockets around in a pool to be used by other requests in the future, otherwise false.
     * The default is false, or the configured default value.
     */
    keepalive?: boolean;

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
     * The max size of the stream buffer, in bytes.
     * The default is 1Mb.
     */
    highWaterMark?: number;

    /**
     * The JSON reviver function to use when deserializing the body of a response.
     * The default is undefined, or the configured default value.
     */
    /* tslint:disable-next-line: prefer-method-signature */
    jsonReviver?: (key: string, value: any) => any;

    /**
     * True if interacting with the clusterfuck that is the NOI API.
     * When enabled, a 200 OK response with no body is handled as a 404 response,
     * and the response content type is ignored and assumed to be "application/json".
     */
    noi?: boolean;
}
