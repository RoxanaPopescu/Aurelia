import { MapObject } from "shared/types";
import { delay } from "shared/utilities";
import { IApiInterceptor } from "../api-interceptor";

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

        // Validate the stubs to prevent the most common mistakes.
        if (ENVIRONMENT.debug)
        {
            const invalidStubs: any[] = [];

            for (const key of Object.keys(this._stubs))
            {
                if (!/^[A-Z]+ \/\/?/.test(key) || (this._stubs[key].body != null && this._stubs[key].data != null))
                {
                    invalidStubs.push(key);
                }
                else if ("body" in this._stubs[key] && "data" in this._stubs[key])
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
     * @returns A promise that will be resolved with the request to send, or the stubbed response, if available.
     */
    public async request(request: Request): Promise<Request | Response>
    {
        const [, host, pathAndQuery] = /(?:https?:\/\/([^/]+))?(.*)/.exec(request.url)!;
        const method = request.method.toUpperCase();
        const url = (host == null || host === location.host) ? pathAndQuery : `//${host}${pathAndQuery}`;

        const key = `${method} ${url}`;

        if (key in this._stubs)
        {
            const stub = this._stubs[key];

            const totalDelay = this._latency + (stub.delay || 0);

            console.warn(`Using response stub for '${method} ${request.url}'${totalDelay ? ` (${totalDelay}ms)` : ""}`);

            const status = stub.status != null ? stub.status : 200;
            const statusText = stub.statusText;

            const body =
                stub.body != null ? stub.body :
                stub.data != null ? JSON.stringify(stub.data) :
                undefined;

            const headers =
            {
                "content-type": body ? "application/json" : undefined,
                ...stub.headers

            } as MapObject<string>;

            await delay(totalDelay, request.signal);

            return new Response(body,
            {
                status,
                statusText,
                headers: Object.keys(headers).map(name => [name, headers[name]])
            });
        }

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
     * The default is to 200.
     */
    status?: number;

    /**
     * The response status text.
     * The default is "ok" for status code 200, otherwise "".
     */
    statusText?: string;

    /**
     * The response headers, .
     * The default is {}.
     */
    headers?: MapObject<string>;

    /**
     * The response body, represented as a string.
     * Note that `body` and `data` cannot both be specified at the same time.
     * The default is "".
     */
    body?: string;

    /**
     * The response body, represented as an object that will be serialized as JSON.
     * Note that `body` and `data` cannot both be specified at the same time.
     * default is undefined;
     */
    data?: any;

    /**
     * The number of milliseconds to delay the response,
     * or undefined to respond without delay.
     * Use this to simulate a realistic response time.
     */
    delay?: number;
}
