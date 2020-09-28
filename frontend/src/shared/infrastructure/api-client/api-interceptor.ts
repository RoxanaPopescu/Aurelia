import { IApiRequestOptions } from "./api-request-options";
import { IApiClientSettings } from "./api-client-settings";

/**
 * Represents an interceptor that, when registered with an `ApiClient`,
 * has the opportunity to intercept requests and responses, enabling
 * modification or short-circuiting.
 */
export interface IApiInterceptor
{
    /**
     * Called when a request is intercepted.
     * @param request The request that was intercepted.
     * @param options The request options to use.
     * @param settings The settings used by the `ApiClient`.
     * @returns The request to send, or the response to use.
     */
    request?(request: Request, options: IApiRequestOptions, settings: IApiClientSettings): Promise<Request | Response>;

    /**
     * Called when a response is intercepted.
     * @param response The response that was intercepted.
     * @param options The request options that were used.
     * @param settings The settings used by the `ApiClient`.
     * @returns The response to use.
     */
    response?(response: Response, options: IApiRequestOptions, settings: IApiClientSettings): Promise<Request | Response>;
}
