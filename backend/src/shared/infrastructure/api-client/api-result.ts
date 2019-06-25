import { Request, Response } from "node-fetch";

/**
 * Represents the result of a successful request.
 */
export class ApiResult<T = any>
{
    /**
     * Creates a new instance of the type.
     * @param request The request sent to the server.
     * @param response The response received from the server.
     * @param data The deserialized response body, if available.
     */
    public constructor(request: Request, response: Response, data?: T)
    {
        this.request = request;
        this.response = response;
        this.data = data;
    }

    /**
     * The request sent to the server
     */
    public request: Request;

    /**
     * The response received from the server
     */
    public response: Response;

    /**
     * The deserialized response body.
     */
    public data: T | undefined;
}
