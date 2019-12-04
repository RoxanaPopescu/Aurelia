import { MapObject } from "../../types";
import { IResponseStubs } from "../api-client-settings";
import { IApiInterceptor } from "../api-interceptor";
import { Request, Response } from "node-fetch";

/**
 * Represents an interceptor that responds with a stubbed response,
 * if one is available for the request.
 */
export class ResponseStubInterceptor implements IApiInterceptor
{
    /**
     * Creates a new instance of the type.
     * @param stubs The response stubs to use.
     */
    public constructor(stubs: IResponseStubs)
    {
        this.stubs = stubs;
        this.validateStubs();
    }

    private readonly stubs: IResponseStubs;

    /**
     * Called when a request is intercepted.
     * @param request The request that was intercepted.
     * @returns The request to send, or the stubbed response, if available.
     */
    public async request(request: Request): Promise<Request | Response>
    {
        const [, host, pathAndQuery] = /(?:https?:\/\/([^/]+))?(.*)/.exec(request.url)!;

        const method = request.method.toUpperCase();

        if (!host)
        {
            throw new Error("No host specified.");
        }
        const url = `//${host}${pathAndQuery}`;

        const stubKey = `${method} ${url}`;

        if (stubKey in this.stubs)
        {
            console.warn(`Using response stub for '${method} ${request.url}'.`);

            const stub = this.stubs[stubKey];

            const body =
                stub.body != null ? stub.body :
                stub.data !== undefined ? JSON.stringify(stub.data) :
                undefined;

            const status =
                stub.status != null ? stub.status :
                body !== undefined ? 200 :
                204;

            const statusText =
                stub.statusText != null ? stub.statusText :
                "";

            const headers: MapObject<string> =
                body !== undefined ? { "content-type": "application/json", ...stub.headers } :
                { ...stub.headers };

            return new Response(body,
            {
                status,
                statusText,
                headers
            });
        }

        return request;
    }

    /**
     * Validates the stubs to prevent the most common mistakes.
     */
    public validateStubs(): void
    {
        const invalidStubs: string[] = [];

        for (const key in this.stubs)
        {
            if (!/^(HEAD|GET|PUT|POST|PATCH|DELETE) \/\/?[^\s]*$/.test(key))
            {
                invalidStubs.push(key);
            }
            else if ("body" in this.stubs[key] && "data" in this.stubs[key])
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
