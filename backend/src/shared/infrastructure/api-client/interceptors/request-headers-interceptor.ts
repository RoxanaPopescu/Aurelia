import { IApiInterceptor } from "../api-interceptor";
import { Request, Response } from "node-fetch";
import { MapObject } from "shared/infrastructure/types";

/**
 * Represents an interceptor that adds headers from the original request to all upstream requests.
 */
export class RequestHeadersInterceptor implements IApiInterceptor
{
    /**
     * Creates a new instance of the type.
     * @param getHeadersFunc The function to call for each intercept, to get the correlation ID.
     */
    public constructor(getHeadersFunc: () => MapObject)
    {
        this.getHeadersFunc = getHeadersFunc;
    }

    private readonly getHeadersFunc: () => MapObject;

    /**
     * Called when a request is intercepted.
     * @param request The request that was intercepted.
     * @returns The request to send, or the stubbed response, if available.
     */
    public async request(request: Request): Promise<Request | Response>
    {
        const headers = this.getHeadersFunc();

        if (headers.correlationId && !request.headers.has("x-correlation"))
        {
            request.headers.set("x-correlation", headers.correlationId);
        }

        if (headers.localeCode && !request.headers.has("x-locale"))
        {
            request.headers.set("x-locale", headers.localeCode);
        }

        if (headers.currencyCode && !request.headers.has("x-currency"))
        {
            request.headers.set("x-currency", headers.currencyCode);
        }

        return request;
    }
}