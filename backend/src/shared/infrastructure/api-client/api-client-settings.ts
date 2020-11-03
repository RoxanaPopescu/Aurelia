import { Type } from "shared/types";
import { IApiInterceptor } from "./api-interceptor";
import { IApiRequestSettings } from "./api-request-settings";

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
     * The cipher to use for obfuscation, which must be a string
     * of 65 unique, URL-safe characters.
     */
    cipher: string;

    /**
     * True to enable obfuscation, otherwise false.
     */
    obfuscate: boolean;

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
     */
    endpointSettings:
    {
        [path: string]: IApiEndpointSettings;
    };

    /**
     * The interceptors, or interceptor types, to use.
     */
    interceptors: (IApiInterceptor | Type<IApiInterceptor>)[];
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

    /**
     * True to always use obfuscation, false to never use obfuscation, or undefined
     * to use obfuscation only when the client `obfuscate` setting is true.
     * The default is undefined.
     */
    obfuscate?: boolean;
}
