import { MapObject } from "shared/types";
import { delay } from "shared/utilities";
import { IApiInterceptor } from "../api-interceptor";
import { IApiRequestOptions } from "../api-request-options";

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
        if (ENVIRONMENT.debug)
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
     * @returns A promise that will be resolved with the request to send, or the stubbed response, if available.
     */
    public async request(request: Request, options: IApiRequestOptions): Promise<Request | Response>
    {
        // Split the request URL.
        const [, host, pathAndQuery] = /(?:https?:\/\/([^/]+))?(.*)/.exec(request.url)!;

        // Determine the key identifying the response stub.
        const method = request.method.toUpperCase();
        const url = (host == null || host === location.host) ? pathAndQuery : `//${host}${pathAndQuery}`;
        const key = `${method} ${url}`;

        // Do we have a response stub for this request?
        if (key in this._stubs)
        {
            // Get the response stub.
            const stub = this._stubs[key];

            // Determine the content type to use.
            const contentType = stub.headers?.["content-type"] ?? (stub.body ? "application/json" : undefined);

            // Determine whether the request body should be serialized as JSON.
            const hasJsonBody = contentType != null && /^application\/(.+\+)?json(;|$)/.test(contentType);

            // Determine the headers to use.
            const headers =
            {
                "content-type": contentType,
                ...stub.headers
            };

            // Determine the status to use.
            const status = stub.status ?? 200;

            // Determine the response delay to use.
            const stubDelay = this._latency + (stub.delay || 0);

            // Log a warning to the console, including info about the request and response.
            console.warn(`Using response stub for '${method} ${request.url}'\n`,
            {
                request: { ...options, headers },
                response: { ...stub, status },
                delay: stubDelay
            });

            // Determine the body to use, and if needed, serialize it as JSON.
            const body =
                stub.body == null ? undefined :
                typeof stub.body === "string" ? stub.body :
                hasJsonBody ? JSON.stringify(stub.body) :
                stub.body as any;

            // Delay the response.
            await delay(stubDelay, request.signal);

            // Create and return the response.
            return new Response(body,
            {
                status: stub.status ?? 200,
                statusText: stub.statusText,
                headers: Object.keys(headers).map(name => [name, headers[name]])
            });
        }

        // No response stub was found, so continue with the original request.
        return request;
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
    [url: string]: IResponseStub;
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
    body?: object | string | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream<Uint8Array>;

    /**
     * The number of milliseconds to delay the response, in addition to the configured stub latency,
     * undefined to respond with no additional delay, or null to respond immediately.
     * The default is undefined;
     */
    delay?: number;
}
