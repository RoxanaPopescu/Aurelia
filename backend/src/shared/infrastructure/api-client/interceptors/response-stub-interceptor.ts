import { URL } from "url";
import { BodyInit, Request, Response } from "node-fetch";
import { environment } from "../../../../env";
import { MapObject } from "../../../types";
import { delay } from "../../../utilities";
import { IApiInterceptor } from "../api-interceptor";
import { IApiRequestOptions } from "../api-request-options";
import { IApiClientSettings } from "../api-client-settings";

/**
 * Represents an interceptor that responds with a stubbed response, if one is available for the request.
 */
export class ResponseStubInterceptor implements IApiInterceptor
{
    /**
     * Creates a new instance of the type.
     * @param stubs The response stubs to use.
     * @param latency The network latency to simulate, in milliseconds.
     */
    public constructor(stubs: IResponseStubs, latency = 0)
    {
        this._stubs = stubs;
        this._latency = latency;

        // Validate the stubs to prevent some of the most common mistakes.
        if (environment.debug)
        {
            const invalidStubs: any[] = [];

            for (const key of Object.keys(this._stubs))
            {
                if (!/^[A-Z]+ \/\/?/.test(key))
                {
                    invalidStubs.push(key);
                }
            }

            if (invalidStubs.length > 0)
            {
                throw new Error(`The following HTTP response stubs are invalid:\n${invalidStubs.join("\n")}`);
            }
        }
    }

    private readonly _stubs: IResponseStubs;
    private readonly _latency: number;

    /**
     * Called when a request is intercepted.
     * @param request The request that was intercepted.
     * @param options The request options to use.
     * @param settings The settings used by the `ApiClient`.
     * @returns A promise that will be resolved with the request to send, or the stubbed response, if available.
     */
    public async request(request: Request, options: IApiRequestOptions, settings: IApiClientSettings): Promise<Request | Response>
    {
        const requestMethod = request.method.toUpperCase();
        const requestUrl = new URL(request.url);

        // Try to get the response stub.

        const apiHost = new URL(settings.endpointUrlPattern).host;

        const stubUrl = requestUrl.host === apiHost
            ? requestUrl.pathname + requestUrl.search
            : `//${requestUrl.host}${requestUrl.pathname + requestUrl.search}`;

        const stubKey = `${requestMethod} ${stubUrl}`;
        const stubValue = this._stubs[stubKey];

        // If no response stub was found, continue with the original request.
        if (stubValue == null)
        {
            return request;
        }

        // Resolve the stub value.

        let stub: IResponseStub;

        if (stubValue instanceof Function)
        {
            // Get the result of the stub.
            const stubResult  = await stubValue(requestMethod, requestUrl, options);

            // If no response stub was returned, continue with the original request.
            if (stubResult == null)
            {
                return request;
            }

            // If the result is a request or response, return that.
            if (stubResult instanceof Request || stubResult instanceof Response)
            {
                // Log a warning to the console, including info about the request and response.
                console.warn(`Using response stub for '${requestMethod} ${request.url}'\n`,
                {
                    request: { ...options },
                    stub: stubResult
                });

                return stubResult;
            }

            stub = { ...stubResult };
        }
        else
        {
            stub = { ...stubValue };
        }

        // Determine the response delay to use.
        const stubDelay = this._latency + (stub.delay || 0);

        // Determine the response content type to use.
        const hasBody = stub.body != null && stub.body !== "";
        const contentType = stub.headers?.["content-type"] ?? (hasBody ? "application/json" : undefined);

        // Determine whether the response body should be serialized as JSON.
        const hasJsonBody = contentType != null && /^application\/(.+\+)?json(;|$)/.test(contentType);

        // Set the content type of the stub, if not specified.
        if (contentType != null)
        {
            stub.headers =
            {
                "content-type": contentType,
                ...stub.headers
            };
        }

        // Set the status of the stub, if not specified.
        if (stub.status == null)
        {
            stub.status = 200;
        }

        // Log a warning to the console, including info about the request and response.
        console.warn(`Using response stub for '${requestMethod} ${request.url}'\n`,
        {
            request: { ...options },
            stub: { ...stub },
            delay: stubDelay
        });

        // Get the body to use for the response.
        const body =
            stub.body == null ? undefined :
            typeof stub.body === "string" ? stub.body :
            hasJsonBody ? JSON.stringify(stub.body) :
            stub.body as any;

        // Get the headers to use for the response.
        const headers =
            stub.headers == null ? undefined :
            Object.keys(stub.headers).map(name => [name, stub.headers![name]]);

        // Delay the response.
        await delay(stubDelay, options.signal);

        // Create and return the response.
        return new Response(body,
        {
            status: stub.status,
            statusText: stub.statusText,
            headers: headers
        });
    }
}

/**
 * Represents the available response stubs.
 */
export interface IResponseStubs
{
    /**
     * The response stubs, where the keys must be of the form `METHOD url`,
     * where `METHOD` is the HTTP verb to match and `url` is the URL to match.
     * Note that the URL must start with either `/` or `//`.
     */
    [key: string]: IResponseStub | ((method: string, url: URL, options: IApiRequestOptions)
        => IResponseStub | Request | Response | Promise<IResponseStub | Request | Response>);
}

/**
 * Represents a response stub.
 */
export interface IResponseStub
{
    /**
     * The response status code.
     * The default is to 200.
     */
    status?: number;

    /**
     * The response status text.
     * The default is `ok` for status code 200, otherwise an empty string.
     */
    statusText?: string;

    /**
     * The response headers.
     * The default is `{ "content-type": "application/json" }` if a body is
     * specified, or `{}` if no body is specified.
     */
    headers?: MapObject<string>;

    /**
     * The response body, which if represented as an object, and the content type
     * is a JSON variant, will be serialized as JSON.
     * The default is undefined;
     */
    body?: object | BodyInit;

    /**
     * The number of milliseconds to delay the response, in addition to the configured stub latency,
     * undefined to respond with no additional delay, or null to respond immediately.
     * The default is undefined;
     */
    delay?: number;
}
