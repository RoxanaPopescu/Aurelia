import { IApiInterceptor } from "../api-interceptor";
import { Request, Response } from "node-fetch";
import { MapObject } from "../../../../shared/types";

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

        if (headers.authorization && !request.headers.has("authorization"))
        {
            request.headers.set("authorization", headers.authorization);
        }

        if (headers.correlationId && !request.headers.has("x-correlation"))
        {
            request.headers.set("x-correlation", headers.correlationId);

            // HACK: Needed because the backend does not yet recognize the new `correlation-id` header.
            request.headers.set("Mover-CorrelationId", headers.correlationId);
        }

        if (headers.apiKey && !request.headers.has("x-api-key"))
        {
            request.headers.set("x-api-key", headers.apiKey);
        }

        if (headers.visitorId && !request.headers.has("x-visitor"))
        {
            request.headers.set("x-visitor", headers.visitorId);
        }

        if (headers.sessionId && !request.headers.has("x-session"))
        {
            request.headers.set("x-session", headers.sessionId);
        }

        if (headers.instanceId && !request.headers.has("x-instance"))
        {
            request.headers.set("x-instance", headers.instanceId);
        }

        if (headers.localeCode && !request.headers.has("x-locale"))
        {
            request.headers.set("x-locale", headers.localeCode);
        }

        if (headers.marketCode && !request.headers.has("x-market"))
        {
            request.headers.set("x-market", headers.marketCode);
        }

        if (headers.currencyCode && !request.headers.has("x-currency"))
        {
            request.headers.set("x-currency", headers.currencyCode);
        }

        if (headers.userId && !request.headers.has("x-user"))
        {
            request.headers.set("x-user", headers.userId);
        }

        if (headers.organizationId && !request.headers.has("x-organization"))
        {
            request.headers.set("x-organization", headers.organizationId);
        }

        return request;
    }
}
