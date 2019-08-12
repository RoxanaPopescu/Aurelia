import { Container, autoinject } from "aurelia-framework";
import { HttpClient } from "aurelia-fetch-client";
import { once, delay } from "shared/utilities";
import { IApiClientSettings, IApiEndpointSettings } from "./api-client-settings";
import { IApiRequestOptions } from "./api-request-options";
import { apiRequestDefaults } from "./api-request-defaults";
import { ApiError, ApiAbortError, transientHttpStatusCodes, missingHttpStatusCodes } from "./api-errors";
import { ApiResult } from "./api-result";

// TODO: We should ideally refactor those dependencies out,
// such that a custom obfuscator/deobfuscator can be used.
import { obfuscate, deobfuscate } from "./api-obfuscation";

// TODO: We should ideally refactor those dependencies out,
// such that a custom serializer/deserializer can be used.
import { DateTime, Duration } from "luxon";

/**
 * Represents a specialized HTTP client for interacting with API endpoints.
 */
@autoinject()
export class ApiClient
{
    /**
     * Creates a new instance of the type.
     * @param container The `Container` instance.
     */
    public constructor(container: Container)
    {
        this._container = container;
        this._httpClient = new HttpClient();
    }

    private readonly _container: Container;
    private readonly _httpClient: HttpClient;
    private _settings: IApiClientSettings;

    /**
     * Configures the instance.
     * @param settings The settings to use.
     */
    @once
    public configure(settings: IApiClientSettings): void
    {
        this._settings = settings;

        // Configure the underlying HTTP client.
        this._httpClient.configure(config =>
        {
            // Add interceptors, if configured.
            if (this._settings.interceptors != null)
            {
                for (const i of this._settings.interceptors)
                {
                    config.withInterceptor(i instanceof Function ? this._container.get(i) : i);
                }
            }
        });
    }

    /**
     * Sends a `HEAD` request to the specified endpoint.
     * This should get a response identical to that of a `GET` request, but without the response body.
     * Note that a `HEAD` request cannot have a body.
     * @param path The path identifying the endpoint.
     * @param options The request options to use, or undefined to use the default options.
     * @returns A promise that will be resolved with the result of the request, if successful.
     */
    public async head<T = any>(path: string, options?: IApiRequestOptions): Promise<ApiResult<T>>
    {
        if (options != null && options.body !== undefined)
        {
            throw new Error("A HEAD request cannot have a body.");
        }

        return this.fetch<T>("HEAD", path, options);
    }

    /**
     * Sends a `GET` request to the specified endpoint.
     * This should get the entity at the specified resource.
     * Note that a `GET` request cannot have a body.
     * @param path The path identifying the endpoint.
     * @param options The request options to use, or undefined to use the default options.
     * @returns A promise that will be resolved with the result of the request, if successful.
     */
    public async get<T = any>(path: string, options?: IApiRequestOptions): Promise<ApiResult<T>>
    {
        if (options != null && options.body !== undefined)
        {
            throw new Error("A GET request cannot have a body.");
        }

        return this.fetch<T>("GET", path, { retry: 0, ...options });
    }

    /**
     * Sends a `PUT` request to the specified endpoint.
     * This should replace the entity at the specified resource.
     * @param path The path identifying the endpoint.
     * @param options The request options to use, or undefined to use the default options.
     * @returns A promise that will be resolved with the result of the request, if successful.
     */
    public async put<T = any>(path: string, options?: IApiRequestOptions): Promise<ApiResult<T>>
    {
        return this.fetch<T>("PUT", path, { retry: 0, ...options });
    }

    /**
     * Sends a `POST` request to the specified endpoint.
     * This should add an entity to the specified resource, or if the resource is an action, execute it.
     * @param path The path identifying the endpoint.
     * @param options The request options to use, or undefined to use the default options.
     * @returns A promise that will be resolved with the result of the request, if successful.
     */
    public async post<T = any>(path: string, options?: IApiRequestOptions): Promise<ApiResult<T>>
    {
        return this.fetch<T>("POST", path, { retry: 0, ...options });
    }

    /**
     * Sends a `PATCH` request to the specified endpoint.
     * This should partially update the entity at the specified resource.
     * @param path The path identifying the endpoint.
     * @param options The request options to use, or undefined to use the default options.
     * @returns A promise that will be resolved with the result of the request, if successful.
     */
    public async patch<T = any>(path: string, options?: IApiRequestOptions): Promise<ApiResult<T>>
    {
        return this.fetch<T>("PATCH", path, { retry: 0, ...options });
    }

    /**
     * Sends a `DELETE` request to the specified endpoint.
     * This should delete the entity at the specified resource.
     * Note that a `DELETE` request cannot have a body.
     * @param path The path identifying the endpoint.
     * @param options The request options to use, or undefined to use the default options.
     * @returns A promise that will be resolved with the result of the request, if successful.
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
     * @returns A promise that will be resolved with the result of the request.
     */
    private async fetch<T>(method: string, path: string, options?: IApiRequestOptions): Promise<ApiResult<T>>
    {
        // Get the endpoint settings.
        const endpointSettings = this.getEndpointSettings(path);

        // Get the request options to use.
        const requestOptions = this.getRequestOptions(options);

        // Get the request URL.
        const requestUrl = this.getRequestUrl(path, requestOptions, endpointSettings);

        // Create the request.
        const request = this.getRequest(method, requestUrl, requestOptions, endpointSettings);

        // Send the request and get the response.
        const response = await this.getResponse(request, requestOptions);

        // Get the deobfuscated and deserialized response body.
        const responseBody = await this.getResponseBody(response, requestOptions, endpointSettings);

        // Does the response indicate that the resource is missing?
        const resourceMissing = missingHttpStatusCodes.includes(response.status);

        // Throw an `ApiError` if the request was unsuccessful.
        if (!response.ok && !(resourceMissing && requestOptions.optional))
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
        let endpointSettings = { ...this._settings.endpointSettings[endpointName] };

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

        // Resolve whether obfuscation should be used.
        if (endpointSettings.obfuscate === undefined)
        {
            endpointSettings.obfuscate = this._settings.obfuscate;
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
        // Obfuscate the path segments, if enabled.
        if (endpointSettings.obfuscate)
        {
            /* tslint:disable-next-line: no-parameter-reassignment */
            path = path.split("/").map(s => obfuscate(s, this._settings.cipher)).join("/");
        }

        // Construct the endpoint URL.
        let fetchUrl = this._settings.endpointUrlPattern
            .replace("{version}", endpointSettings.version)
            .replace("{path}", path);

        // Construct and append the query string.
        if (options.query != null)
        {
            const queryParams: string[] = [];

            // Append the parameters, ordered by name to ensure consistent, cache-friendly URLs.
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
                let query = queryParams.join("&");

                // Obfuscate the query string, if enabled.
                if (endpointSettings.obfuscate)
                {
                    query = obfuscate(query, this._settings.cipher);
                }

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
     * @param endpointSettings The endpoint settings to use.
     * @returns The fetch request to be sent.
     */
    private getRequest(method: string, fetchUrl: string, options: IApiRequestOptions, endpointSettings: IApiEndpointSettings): Request
    {
        // Construct the fetch options.
        const fetchOptions: RequestInit =
        {
            method,
            headers: options.headers,
            mode: options.mode,
            cache: options.cache,
            redirect: options.redirect,
            referrer: options.referrer,
            referrerPolicy: options.referrerPolicy,
            signal: options.signal,
            integrity: options.integrity,
            credentials: options.credentials
        };

        // Add the body, if specified.
        if (options.body !== undefined)
        {
            // Determine whether the request body should be stringified as JSON.
            const contentType = options.headers ? options.headers["content-type"] : undefined;
            const hasJsonBody = contentType && /^application\/(.+\+)?json(;|$)/.test(contentType);

            // Stringify the request body, if needed.
            const body = hasJsonBody ? JSON.stringify(options.body) : options.body as any;

            // Obfuscate the body, if enabled.
            if (endpointSettings.obfuscate)
            {
                fetchOptions.body = obfuscate(body, this._settings.cipher);
            }
            else
            {
                fetchOptions.body = body;
            }
        }

        // Create the request.
        return new Request(fetchUrl, fetchOptions);
    }

    /**
     * Sends the specified fetch request and gets the response.
     * @param fetchRequest The request to send.
     * @param options The request options to use.
     * @returns A promise that will be resolved with the response to the fetch request.
     */
    private async getResponse(fetchRequest: Request, options: IApiRequestOptions): Promise<Response>
    {
        let fetchResponse: Response | undefined;

        // Attempt to get the response, retrying as specified in the options.
        for (let attempt = 0; attempt < options.retry! + 1; attempt++)
        {
            try
            {
                // Send the request and await the response.
                fetchResponse = await this._httpClient.fetch(fetchRequest);

                // Does the response represent a transient error?
                if (transientHttpStatusCodes.includes(fetchResponse.status))
                {
                    throw new ApiError(true, fetchRequest, fetchResponse);
                }

                break;
            }
            catch (error)
            {
                // Throw an `AbortError` if the request was intentionally aborted.
                if (error.name === "AbortError")
                {
                    throw new ApiAbortError(fetchRequest);
                }

                // Throw an `ApiError` if the error is non-transient.
                if (error.transient !== true)
                {
                    throw new ApiError(false, fetchRequest, fetchResponse, error.message);
                }

                // Throw an `ApiError` if the error is transient and the retry attempts have been exhausted.
                if (attempt === options.retry)
                {
                    throw new ApiError(true, fetchRequest, fetchResponse, error.message);
                }

                try
                {
                    // Await the next retry.
                    const retryDelayIndex = Math.min(attempt, options.retryDelay!.length - 1);
                    const retryDelay = options.retryDelay![retryDelayIndex];
                    await delay(retryDelay, options.signal);
                }
                catch (delayError)
                {
                    throw new ApiAbortError(fetchRequest);
                }
            }
        }

        return fetchResponse!;
    }

    /**
     * Gets the deobfuscated and deserialized response body, if enabled.
     * @param fetchRequest The request to send.
     * @param options The request options to use.
     * @param endpointSettings The endpoint settings to use.
     * @returns A promise that will be resolved with the deobfuscated and deserialized
     * response body, or undefined if deserialization is disabled.
     */
    private async getResponseBody(fetchResponse: Response, options: IApiRequestOptions, endpointSettings: IApiEndpointSettings): Promise<any>
    {
        // Determine whether the response body can be parsed as JSON.
        const contentType = fetchResponse.headers.get("content-type");
        const hasJsonBody = contentType && /^application\/(.+\+)?json(;|$)/.test(contentType);

        // Deserialize the response body, if enabled.
        if (options.deserialize && hasJsonBody)
        {
            // Await the response body.
            let text = await fetchResponse.text();

            // Deobfuscate the body, if enabled.
            if (endpointSettings.obfuscate)
            {
                text = deobfuscate(text, this._settings.cipher);
            }

            // Deserialize the body, using the configured JSON reviver.
            return JSON.parse(text, options.jsonReviver);
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
