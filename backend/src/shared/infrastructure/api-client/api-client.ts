import fetch, { Request, Response, RequestInit } from "node-fetch";
import { once } from "../utilities/decorators/once";
import { delay } from "../utilities/timing/delay";
import { IApiClientSettings, IApiEndpointSettings } from "./api-client-settings";
import { IApiRequestOptions } from "./api-request-options";
import { apiRequestDefaults } from "./api-request-defaults";
import { IApiInterceptor } from "./api-interceptor";
import { ApiError, ApiAbortError, transientHttpStatusCodes, missingHttpStatusCodes } from "./api-errors";
import { ApiResult } from "./api-result";
import { container, inject } from "../container";

// TODO: We should ideally refactor those dependencies out,
// such that a custom serializer/deserializer can be used.
import { DateTime, Duration } from "luxon";

/**
 * Represents a specialized HTTP client for interaction with API endpoints.
 */
@inject
export class ApiClient
{
    private _settings: IApiClientSettings;
    private _interceptors: IApiInterceptor[];

    /**
     * Configures the instance.
     * @param settings The settings to use.
     */
    @once
    public configure(settings: IApiClientSettings): void
    {
        this._settings = settings;
        this._interceptors = [];

        // Add, and if needed instantiate, any interceptors specified in the settings.
        if (this._settings.interceptors != null)
        {
            for (const interceptor of this._settings.interceptors)
            {
                const interceptorInstance = interceptor instanceof Function
                    ? container.get(interceptor)
                    : interceptor;

                this._interceptors.push(interceptorInstance);
            }
        }
    }

    /**
     * Sends a `HEAD` request to the specified endpoint.
     * Note that a `HEAD` request cannot have a body.
     * @param path The path identifying the endpoint.
     * @param options The request options to use.
     * @returns The result of the request, if successful.
     */
    public async head<T = any>(path: string, options?: IApiRequestOptions): Promise<ApiResult<T>>
    {
        if (options != null && options.body !== undefined)
        {
            throw new Error("A HEAD request cannot have a body.");
        }

        return this.fetch<T>("HEAD", path, this.getRequestOptions(options));
    }

    /**
     * Sends a `GET` request to the specified endpoint.
     * Note that a `GET` request cannot have a body.
     * @param path The path identifying the endpoint.
     * @param options The request options to use.
     * @returns The result of the request, if successful.
     */
    public async get<T = any>(path: string, options?: IApiRequestOptions): Promise<ApiResult<T>>
    {
        if (options != null && options.body !== undefined)
        {
            throw new Error("A GET request cannot have a body.");
        }

        return this.fetch<T>("GET", path, this.getRequestOptions(options));
    }

    /**
     * Sends a `PUT` request to the specified endpoint.
     * @param path The path identifying the endpoint.
     * @param options The request options to use.
     * @returns The result of the request, if successful.
     */
    public async put<T = any>(path: string, options?: IApiRequestOptions): Promise<ApiResult<T>>
    {
        return this.fetch<T>("PUT", path, this.getRequestOptions({ retry: 0, ...options }));
    }

    /**
     * Sends a `POST` request to the specified endpoint.
     * @param path The path identifying the endpoint.
     * @param options The request options to use.
     * @returns The result of the request, if successful.
     */
    public async post<T = any>(path: string, options?: IApiRequestOptions): Promise<ApiResult<T>>
    {
        return this.fetch<T>("POST", path, this.getRequestOptions({ retry: 0, ...options }));
    }

    /**
     * Sends a `PATCH` request to the specified endpoint.
     * @param path The path identifying the endpoint.
     * @param options The request options to use.
     * @returns The result of the request, if successful.
     */
    public async patch<T = any>(path: string, options?: IApiRequestOptions): Promise<ApiResult<T>>
    {
        return this.fetch<T>("PATCH", path, this.getRequestOptions({ retry: 0, ...options }));
    }

    /**
     * Sends a `DELETE` request to the specified endpoint.
     * Note that a `DELETE` request cannot have a body.
     * @param path The path identifying the endpoint.
     * @param options The request options to use.
     * @returns The result of the request, if successful.
     */
    public async delete<T = any>(path: string, options?: IApiRequestOptions): Promise<ApiResult<T>>
    {
        if (options != null && options.body !== undefined)
        {
            throw new Error("A DELETE request cannot have a body.");
        }

        return this.fetch<T>("DELETE", path, { retry: 0, ...options });
    }

    /**
     * Fetches the response from the specified endpoint.
     * @param method The HTTP method to use.
     * @param path The path identifying the endpoint.
     * @param options The request options to use.
     * @returns The result of the request, if successful.
     */
    private async fetch<T>(method: string, path: string, options: IApiRequestOptions): Promise<ApiResult<T>>
    {
        // Get the endpoint settings.
        const endpointSettings = this.getEndpointSettings(path);

        // Get the request URL.
        const requestUrl = this.getRequestUrl(path, options, endpointSettings);

        // Create the request.
        const request = this.getRequest(method, requestUrl, options);

        // Get the response to the request.
        const response = await this.getResponse(request, options);

        // Get the deserialized response body.
        const responseBody = await this.getResponseBody(response, options);

        // Does the response indicate that the resource is missing?
        const resourceMissing = missingHttpStatusCodes.includes(response.status);

        // Throw an `ApiError` if the request was unsuccessful.
        if (!response.ok && !(resourceMissing && options.optional))
        {
            throw new ApiError(false, request, response, undefined, responseBody);
        }

        // Return the result of the request.
        return new ApiResult<T>(request, response, responseBody);
    }

    /**
     * Gets the request options to use, by the merging hardcoded defaults,
     * the configured defaults, and the specified options.
     * @param options The options specified for the request.
     * @returns The merged request options.
     */
    private getRequestOptions(options?: IApiRequestOptions): IApiRequestOptions
    {
        // Merge the defaults, settings and options.
        const mergedOptions: IApiRequestOptions =
        {
            ...apiRequestDefaults,
            ...this._settings.defaults,
            ...options
        };

        // Merge the headers specified in the defaults, settings and options.
        mergedOptions.headers =
        {
            ...apiRequestDefaults.headers,
            ...this._settings.defaults ? this._settings.defaults.headers : undefined,
            ...options ? options.headers : undefined
        };

        return mergedOptions;
    }

    /**
     * Gets the settings for the endpoint with the specified path.
     * @param path The path identifying the endpoint.
     * @returns The settings to use for the endpoint.
     */
    private getEndpointSettings(path: string): IApiEndpointSettings
    {
        // Get the name of the endpoint configuration that best matches the path.
        const endpointName = Object.keys(this._settings.endpointSettings)
            .filter(key => path === key || path.startsWith(`${key}/`))
            .reduce((bestKey, key) => key.length > bestKey.length ? key : bestKey, "");

        // Get the settings for the endpoint.
        let endpointSettings = this._settings.endpointSettings[endpointName];

        // Verify that the settings were found.
        if (endpointSettings == null)
        {
            throw new Error(`Could not find any settings matching the endpoint '${path}'.`);
        }

        // If the settings are a string, assume it's the version.
        if (typeof endpointSettings === "string")
        {
            endpointSettings = { version: endpointSettings };
        }

        // Verify that the settings include a version.
        if (!endpointSettings.version)
        {
            throw new Error(`The settings for the endpoint '${path}' must specify a version.`);
        }

        return endpointSettings;
    }

    /**
     * Gets the URL to be used for the request.
     * @param path The path identifying the endpoint.
     * @param options The request options to use.
     * @param endpointSettings The endpoint settings to use.
     * @returns The URL to be used for the request.
     */
    private getRequestUrl(path: string, options: IApiRequestOptions, endpointSettings: IApiEndpointSettings): string
    {
        // Construct the endpoint URL.
        let fetchUrl = this._settings.endpointUrlPattern
            .replace("{version}", endpointSettings.version)
            .replace("{path}", path);

        // Construct and append the query string.
        if (options.query != null)
        {
            const queryParams: string[] = [];

            // Append the parameters, ordered by name to ensure consistent, cache-friendly URL's.
            for (const key of Object.keys(options.query).sort())
            {
                // Get the value of the query parameter.
                const value = options.query[key];

                // If the value is null or undefined, ignore it.
                if (value == null)
                {
                    continue;
                }

                // Add the encoded query parameter.
                queryParams.push(`${this.encodeQueryComponent(key)}=${this.encodeQueryValue(value)}`);
            }

            if (queryParams.length > 0)
            {
                // Construct the query string by join the parameters.
                const query = queryParams.join("&");

                // Append the query string to the endpoint URL.
                fetchUrl += `${fetchUrl.includes("?") ? "&" : "?"}${query}`;
            }
        }

        return fetchUrl;
    }

    /**
     * Gets the fetch request to be sent.
     * @param method The HTTP method to use.
     * @param fetchUrl The URL to be used for the request.
     * @param options The request options to use.
     * @returns The fetch request to be sent.
     */
    private getRequest(method: string, fetchUrl: string, options: IApiRequestOptions): Request
    {
        // Construct the fetch options.
        const fetchOptions: RequestInit =
        {
            method,
            headers: options.headers,
            redirect: options.redirect,
            signal: options.signal
        };

        // Add the body, if specified.
        if (options.body != null)
        {
            fetchOptions.body = JSON.stringify(options.body);
        }

        // Create the request.
        return new Request(fetchUrl, fetchOptions);
    }

    private async getResponse(request: Request, options: IApiRequestOptions): Promise<Response>
    {
        let current: Request | Response = request;

        while (current instanceof Request)
        {
            // Apply the interceptors to the request.
            current = await this.interceptRequest(current);

            if (current instanceof Request)
            {
                current = await this.sendRequestAndGetResponse(current, options);
            }

            // Apply the interceptors to the response.
            current = await this.interceptResponse(current);
        }

        return current;
    }

    /**
     * Applies any registered interceptors to the specified request.
     * @param request The request to intercept.
     * @returns The request or response to use, or the specified request if not intercepted.
     */
    private async interceptRequest(request: Request): Promise<Request | Response>
    {
        let current = request;

        for (const interceptor of this._interceptors)
        {
            if (interceptor.request != null)
            {
                const result = await interceptor.request(current);

                if (result instanceof Request)
                {
                    current = result;
                }
                else if (result instanceof Response)
                {
                    return result;
                }
            }
        }

        return current;
    }

    /**
     * Applies any registered interceptors to the specified response.
     * @param response The response to intercept.
     * @returns The response to use, or a new request.
     */
    private async interceptResponse(response: Response): Promise<Request | Response>
    {
        let current = response;

        for (const interceptor of this._interceptors)
        {
            if (interceptor.response != null)
            {
                const result = await interceptor.response(current);

                if (result instanceof Response)
                {
                    current = result;
                }
                else if (result instanceof Request)
                {
                    return result;
                }
            }
        }

        return current;
    }

    /**
     * Sends the specified fetch request and gets the response.
     * @param request The request to send.
     * @param options The request options to use.
     * @returns The response to the fetch request.
     */
    private async sendRequestAndGetResponse(request: Request, options: IApiRequestOptions): Promise<Response>
    {
        let response: Response | undefined;

        // Attempt to get the response, retrying as specified in the options.
        for (let attempt = 0; attempt < options.retry! + 1; attempt++)
        {
            try
            {
                // Send the request and await the response.
                response = await fetch(request);

                // Does the response represent a transient error?
                if (transientHttpStatusCodes.includes(response.status))
                {
                    throw new ApiError(true, request, response);
                }

                break;
            }
            catch (error)
            {
                // Throw an `AbortError` if the request was intentionally aborted.
                if (error.name === "AbortError")
                {
                    throw new ApiAbortError(request);
                }

                // Throw an `ApiError` if the error is non-transient.
                if (error.transient !== false)
                {
                    throw new ApiError(false, request, response, error.message);
                }

                // Throw an `ApiError` if the error is transient and the retry attempts have been exhausted.
                if (attempt === options.retry)
                {
                    throw new ApiError(true, request, response, error.message);
                }

                try
                {
                    // Await the next retry.
                    const retryDelayIndex = Math.min(attempt, options.retryDelay!.length - 1);
                    const retryDelay = options.retryDelay![retryDelayIndex];
                    await delay(retryDelay, options.signal).catch();
                }
                catch (delayError)
                {
                    throw new ApiAbortError(request);
                }
            }
        }

        return response!;
    }

    /**
     * Gets the deserialized response body, if enabled.
     * @param fetchRequest The request to send.
     * @param options The request options to use.
     * @returns The deserialized response body, or undefined if deserialization is disabled.
     */
    private async getResponseBody(fetchResponse: Response, options: IApiRequestOptions): Promise<any>
    {
        // Determine whether the response body can be parsed as JSON.
        const contentType = fetchResponse.headers.get("content-type");
        const hasJsonBody = contentType && /^application\/(.+\+)?json(;|$)/.test(contentType);

        // Deserialize the response body, if enabled.
        if (options.deserialize && hasJsonBody)
        {
            // Await the response body.
            const body = await fetchResponse.text();

            // Deserialize the body, using the configured JSON reviver.
            return JSON.parse(body, options.jsonReviver);
        }

        return undefined;
    }

    /**
     * Encodes the specified text for use in a query string.
     * @param text The text to encode.
     * @returns The encoded text.
     */
    private encodeQueryComponent(text: any): string
    {
        // Encode the text, taking into account that the characters '/' and '?'
        // do not need to be encoded in the query part of an URL.
        return encodeURIComponent(text.toString()).replace(/%2F/g, "/").replace(/%3F/g, "?");
    }

    /**
     * Encodes the specified value for use in a query string.
     * @param value The value to encode.
     * @param isNested True if the value is nested, and therefore can't be complex, otherwise false.
     * @returns The encoded value.
     */
    private encodeQueryValue(value: any, isNested?: boolean): string
    {
        // If the value is null or undefined, return an empty string.
        if (value == null)
        {
            return "";
        }

        // If the value is a native date, convert it to ISO-8601 format.
        if (value instanceof Date)
        {
            return value.toISOString();
        }

        // If the value is a Luxon date, convert it to ISO-8601 format.
        if (value instanceof DateTime)
        {
            return value.toISO();
        }

        // If the value is a Luxon duration, convert it to ISO-8601 format.
        if (value instanceof Duration)
        {
            return value.toISO();
        }

        // If the value is an array, convert it to a comma-separated list of values.
        if (!isNested && value instanceof Array)
        {
            return value.map(v => this.encodeQueryValue(v, true)).join(",");
        }

        // If the value is a set, convert it to a comma-separated list of values.
        if (!isNested && value instanceof Set)
        {
            return Array.from(value).map(v => this.encodeQueryValue(v, true)).join(",");
        }

        // If the value is a map, convert it to a comma-separated list of 'key:value' pairs.
        if (!isNested && value instanceof Map)
        {
            return Array.from(value).map(([k, v]) => `${k}:${this.encodeQueryValue(v, true)}`).join(",");
        }

        // If the value is an object, convert it to comma-separated list of 'key:value' pairs.
        if (!isNested && value instanceof Object)
        {
            return Object.keys(value).map(k => `${k}:${this.encodeQueryValue(value[k], true)}`).join(",");
        }

        // Otherwise, convert the value to its default string representation,
        // and encode it for use in the query string.
        return this.encodeQueryComponent(value.toString());
    }
}
