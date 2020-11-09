import { Request, Response } from "node-fetch";
import { AbortError } from "../../../shared/types";

/**
 * The HTTP status codes that represent transient errors.
 */
export const transientHttpStatusCodes = [408, 502, 503, 504] as ReadonlyArray<number>;

/**
 * The HTTP status codes that represent a missing or deleted resource.
 */
export const missingHttpStatusCodes = [404, 410] as ReadonlyArray<number>;

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
        super(message || `Request type '${request.method}' for '${request.url}' was aborted.`);

        // Required to ensure a correct prototype chain.
        // See: https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, ApiAbortError.prototype);

        this.name = "ApiAbortError";
        this.request = request;
    }

    /**
     * The request that was aborted.
     */
    public readonly request: Request;
}

/**
 * Represents the error thrown when the request fails, or when the response
 * received from the endpoint indicate that an error occurred.
 */
export class ApiError<TData = any> extends Error
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
                `Request of type '${request.method}' for '${request.url}' failed with status code ${response.status}${response.statusText ? ` (${response.statusText})` : ""}.` :
                `Request type '${request.method}' for '${request.url}' failed.`
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
     * Transient errors include e.g. DNS lookup failures, gateway
     * timeouts, server unavailability, etc.
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
    public readonly data: TData;
}

/**
 * Represents the error thrown when the request fails, or when the response
 * received from the endpoint indicate that an error occurred.
 */
export class ApiOriginError extends ApiError<IApiProblem>
{
    /**
     * Creates a new instance of the type.
     * @param transient True if the error is a transient error, otherwise false.
     * @param request The request sent to the server.
     * @param response The response received from the server.
     * @param message The message describing the error.
     * @param data The deserialized response body, if available.
     */
    public constructor(transient: boolean, request: Request, response: Response, message?: string, data?: any)
    {
        if (data === undefined)
        {
            // tslint:disable-next-line: no-parameter-reassignment
            data = { status: response.status, type: `https://httpstatuses.com/${response.status}` };
        }

        super(transient, request, response, message, data);

        // Required to ensure a correct prototype chain.
        // See: https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, ApiOriginError.prototype);

        this.name = "ApiOriginError";
    }

    /**
     * The response received from the server.
     */
    public readonly response: Response;

    /**
     * The deserialized response body, describing the problem that
     * occurred at the origin server.
     */
    public readonly data: IApiProblem;
}

/**
 * Represents the body of a response received from an endpoint,
 * when the response indicate that an error occurred.
 *
 * This conforms to the RFC-7807 specification for the body of
 * a response with content type `application/problem+json`.
 * See: https://datatracker.ietf.org/doc/rfc7807
 */
export interface IApiProblem
{
    /**
     * The HTTP status code generated by the origin server for this
     * occurrence of the problem.
     */
    readonly status: number;

    /**
     * A URI reference that identifies the problem type.
     * It may or may not yield further information if dereferenced.
     */
    readonly type: string;

    /**
     * A short, human-readable summary of the problem type,
     * localized for the locale specified in the request.
     */
    readonly title: string | undefined;

    /**
     * A human-readable explanation specific to this occurrence of the problem,
     * localized for the locale specified in the request.
     */
    readonly detail: string | undefined;

    /**
     * A URI reference that identifies the specific occurrence of the problem.
     * It may or may not yield further information if dereferenced.
     */
    readonly instance: string | undefined;

    /**
     * Additional properties specific to the problem type.
     */
    readonly [key: string]: any;
}

/**
 * Represents the error thrown when the request fails, or when the response
 * received from the endpoint indicate that an error occurred.
 */
export class ApiValidationError extends ApiOriginError
{
    /**
     * Creates a new instance of the type.
     * @param transient True if the error is a transient error, otherwise false.
     * @param request The request sent to the server.
     * @param response The response received from the server.
     * @param message The message describing the error.
     * @param data The deserialized response body, if available.
     */
    public constructor(transient: boolean, request: Request, response: Response, message?: string, data?: any)
    {
        super(transient, request, response, message, data);

        // Required to ensure a correct prototype chain.
        // See: https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, ApiValidationError.prototype);

        this.name = "ApiValidationError";
    }

    /**
     * The deserialized response body, describing the validation
     * problem that occurred at the origin server.
     */
    public readonly data: IApiValidationProblem;
}

/**
 * Represents the body of a response received from an endpoint,
 * when the response indicate that validation errors occurred.
 *
 * This conforms to the RFC-7807 specification for the body of
 * a response with content type `application/problem+json`.
 * See: https://datatracker.ietf.org/doc/rfc7807
 *
 * Note that this extends the problem details with properties
 * that are specific to validation in ASP.NET Core.
 * See: https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.mvc.validationproblemdetails
 */
export interface IApiValidationProblem extends IApiProblem
{
    /**
     * The validation errors that occurred, represented by an object mapping
     * property names to the errors messages associated with the property,
     * localized for the locale specified in the request.
     */
    readonly errors: { [key: string]: string[] };
}

/**
 * Represents the error thrown when the response received from a NOI endpoint
 * indicate that an error occurred.
 */
export class NoiApiOriginError extends ApiOriginError
{
    /**
     * Creates a new instance of the type.
     * @param transient True if the error is a transient error, otherwise false.
     * @param request The request sent to the server.
     * @param response The response received from the server.
     * @param message The message describing the error.
     * @param data The deserialized response body, if available.
     */
    public constructor(transient: boolean, request: Request, response: Response, message?: string, data?: any)
    {
        // tslint:disable-next-line: no-parameter-reassignment
        const problemData =
        {
            status: response.status,
            type: data?.status != null ? `noi/${data.status}` : `https://httpstatuses.com/${response.status}`,
            title: data?.data?.text,
            errorCode: data?.status
        };

        super(transient, request, response, message, problemData);

        // Required to ensure a correct prototype chain.
        // See: https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, ApiOriginError.prototype);

        this.name = "NoiApiOriginError";
    }

    /**
     * The response received from the server.
     */
    public readonly response: Response;
}
