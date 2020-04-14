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
     * @returns The request to send, or the response to use.
     */
    request?(request: Request): Promise<Request | Response>;

    /**
     * Called when a response is intercepted.
     * @param response The response that was intercepted.
     * @returns The response to use.
     */
    response?(response: Response): Promise<Request | Response>;
}
