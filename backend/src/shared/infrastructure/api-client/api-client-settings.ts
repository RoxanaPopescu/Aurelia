import { Type, MapObject } from "../types";
import { IApiRequestSettings } from "./api-request-settings";
import { IApiInterceptor } from "./api-interceptor";

/**
 * Represents the settings for the API client.
 */
export interface IApiClientSettings
{
    /**
     * The default request options to use.
     */
    defaults?: IApiRequestSettings;

    /**
     * The URL pattern for the endpoints, where `{version}` will be replaced with
     * the endpoint version, and `{path}` will be replaced with the endpoint path.
     */
    endpointUrlPattern: string;

    /**
     * The endpoint settings, where the keys represent the path to which
     * the setting applies. If multiple settings match a request, the most
     * specific match will be used. Note that default settings for all
     * endpoints may be specified with an empty string as key.
     * If a string is specified, it is assumed to be the version.
     */
    endpointSettings:
    {
        [path: string]: IApiEndpointSettings | string;
    };

    /**
     * The interceptors, or interceptor types, to use.
     */
    interceptors?: (IApiInterceptor | Type<IApiInterceptor>)[];
}

/**
 * Represents the settings for an API endpoint.
 */
export interface IApiEndpointSettings
{
    /**
     * The version of the endpoint to use.
     */
    version: string;
}

/**
 * Represents the available response stubs.
 */
export interface IResponseStubs
{
    /**
     * The response stubs, where the keys must be of the form `METHOD url`,
     * where `METHOD` is the HTTP verb to match and `url` is the URL to match.
     * Note that the URL must start with either "/" or "//".
     */
    [url: string]: IResponseStub;
}

/**
 * Represents a response stub.
 */
export interface IResponseStub
{
    /**
     * The response status code.
     * Default is to 200.
     */
    status?: number;

    /**
     * The response status text.
     * Default is "ok" for status code 200, otherwise "".
     */
    statusText?: string;

    /**
     * The response headers, .
     * Default is {}.
     */
    headers?: MapObject<string>;

    /**
     * The response body, represented as a string.
     * Note that `body` and `data` cannot both be specified at the same time.
     * Default is "".
     */
    body?: string;

    /**
     * The response body, represented as an object that will be serialized as JSON.
     * Note that `body` and `data` cannot both be specified at the same time.
     * default is undefined;
     */
    data?: any;
}
