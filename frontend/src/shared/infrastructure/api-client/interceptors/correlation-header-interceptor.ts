import { Id } from "shared/utilities";
import { IApiInterceptor } from "../api-interceptor";
import { IApiRequestOptions } from "../api-request-options";

/**
 * Represents an interceptor that adds a header with a correlation ID to the request.
 * Note that the header will only be added if it does not already exists.
 */
export class CorrelationHeaderInterceptor implements IApiInterceptor
{
    /**
     * Creates a new instance of the type.
     * @param headerName The name of the header to add.
     */
    public constructor(headerName: string)
    {
        this._headerName = headerName;
    }

    private readonly _headerName: string;

    /**
     * Called when a request is intercepted.
     * @param request The request that was intercepted.
     * @param options The request options to use.
     * @returns A promise that will be resolved with the request to send, or the stubbed response, if available.
     */
    public async request(request: Request, options: IApiRequestOptions): Promise<Request | Response>
    {
        if (!request.headers.has(this._headerName))
        {
            request.headers.set(this._headerName, Id.uuid(1));
        }

        return request;
    }
}
