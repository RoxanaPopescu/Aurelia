import { Type } from "../../types";
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
     * The cipher to use for obfuscation, which must be a string of 65 unique,
     * URL-safe characters, or undefined to disable obfuscation.
     */
    cipher?: string;

    /**
     * The URL pattern for the endpoints, where `{version}` will be replaced with
     * the endpoint version, and `{path}` will be replaced with the endpoint path.
     */
    endpointUrlPattern: string;

    /**
     * The URL pattern for the NOI endpoints, where `{path}` will be replaced
     * with the endpoint path.
     */
    noiEndpointUrlPattern: string;

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
     * True to use obfuscation if a cipher is specified, otherwise false.
     * The default is true.
     */
    obfuscate?: boolean;
}
