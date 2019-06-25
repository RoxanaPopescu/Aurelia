import { Request, Response } from "node-fetch";
import { AbortError } from "../types/abort-error";

/**
 * The HTTP status codes that represent transient errors.
 */
export const transientHttpStatusCodes = [502, 503, 504] as ReadonlyArray<number>;

/**
 * The HTTP status codes that represent a missing or deleted resource.
 */
export const missingHttpStatusCodes = [404, 410] as ReadonlyArray<number>;

/**
 * Represents the error thrown when the request fails, or when the response
 * received from the endpoint indicate that an error has occurred.
 */
export class ApiError extends Error
{
    /**
     * Creates a new instance of the type.
     * @param transient True if the error is a transient error, otherwise false.
     * @param request The request sent to the server.
     * @param response The response received from the server.
     * @param message The message describing the error.
     * @param data The deserialized response body, if available.
     */
    public constructor(transient: boolean, request: Request, response?: Response, message?: string, data?: any)
    {
        super(message ||
        (
            response != null ?
            `Request for '${request.url}' failed with status code ${response.status} (${response.statusText}).` :
            `Request for '${request.url}' failed.`
        ));

        // Required to ensure a correct prototype chain.
        // See: https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, ApiError.prototype);

        this.name = "ApiError";
        this.transient = transient;
        this.request = request;
        this.response = response;
        this.data = data;
    }

    /**
     * True if the error is a transient error, otherwise false.
     * Transient errors include e.g. DNS lookup failures, gateway timeouts,
     * server unavailability, etc.
     */
    public readonly transient: boolean;

    /**
     * The request sent to the server.
     */
    public readonly request: Request;

    /**
     * The response received from the server.
     */
    public readonly response: Response | undefined;

    /**
     * The deserialized response body, if available.
     */
    public readonly data: any | undefined;
}

/**
 * Represents the error thrown when the request is intentionally aborted.
 */
export class ApiAbortError extends AbortError
{
    /**
     * Creates a new instance of the type.
     * @param request The request sent to the server.
     * @param message The message describing the error.
     */
    public constructor(request: Request, message?: string)
    {
        super(message || `Request for '${request.url}' was aborted.`);

        // Required to ensure a correct prototype chain.
        // See: https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, ApiAbortError.prototype);

        this.request = request;
    }

    /**
     * The request that was aborted.
     */
    public readonly request: Request;
}
