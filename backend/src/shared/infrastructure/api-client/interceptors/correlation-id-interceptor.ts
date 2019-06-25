import { IApiInterceptor } from "../api-interceptor";
import { Request, Response } from "node-fetch";

/**
 * Represents an interceptor that adds a correlation ID to all outgoing requests.
 */
export class CorrelationIdInterceptor implements IApiInterceptor
{
    /**
     * Creates a new instance of the type.
     * @param getCorrelationIdFunc The function to call for each intercept, to get the correlation ID.
     */
    public constructor(getCorrelationIdFunc: () => string)
    {
        this.getCorrelationIdFunc = getCorrelationIdFunc;
    }

    private readonly getCorrelationIdFunc: () => string;

    /**
     * Called when a request is intercepted.
     * @param request The request that was intercepted.
     * @returns The request to send, or the stubbed response, if available.
     */
    public async request(request: Request): Promise<Request | Response>
    {
        const correlationId = this.getCorrelationIdFunc();

        if (correlationId)
        {
            request.headers.set("correlation-id", correlationId);
        }

        return request;
    }
}
