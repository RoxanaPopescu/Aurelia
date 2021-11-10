import { ParameterizedContext } from "koa";
import { IRouterParamContext } from "koa-router";
import { IPaging, ISorting } from "../shared/types";
import { User } from "./middleware/authorize-middleware";
import { IFakeRequest, IFakeResponse } from "./middleware/fetch-middleware";

/**
 * Represents the custom properties and methods added to the context.
 */
export interface IAppContext
{
    /**
     * The authenticated user, if a JWT is specified.
     */
    user?: User | null;

    /**
     * The paging to use, if specified.
     */
    paging?: IPaging;

    /**
     * The sorting to use, if specified.
     */
    sorting?: ISorting;

    /**
     * Verifies that the user is authenticated, and that the user has all the
     * specified permissions. If authorization fails, an error will be thrown,
     * which eventually results in an 401 response.
     * @param permissions The permissions required for authorization to succeede.
     * @returns A promise that will be resolved when the operation completes.
     */
    authorize(...permissions: AuthorizeParameter[]): Promise<void>;

    /**
     * Marks any code that is executed after the call to this method as internal.
     * This means, that if an `ApiError` occurs, its response status will no longer
     * be forwarded to the client, but instead result in a response to the client
     * with status 500, indicating an internal server error.
     */
    internal(): void;

    /**
     * Makes an internal request to another endpoint.
     *
     * Note that only endpoints that are defined as methods on a
     * module are supported; endpoints that are manually added to
     * the router are not.
     *
     * Also note that no `next` method will be provided to the endpoint,
     * and that the context provided will not be a real context instance,
     * but a fake instance with only the the most essential properties.
     *
     * @param endpoint The name of the endpoint, which must match the pattern `{HEAD|GET|POST|PUT|PATCH|DELETE} /{path}`.
     * @param request The fake request object.
     * @returns The fake response object.
     */
    fetch(endpoint: string, request?: IFakeRequest): Promise<IFakeResponse>;
}

/**
 * Represents a parameter for the `authorize` method on the context.
 */
export type AuthorizeParameter = string | boolean | (() => boolean | Promise<boolean>) | { organization?: string; teams?: string | string[] };

/**
 * Represents the context passed to the request handler.
 */
export type AppContext = ParameterizedContext<any, IAppContext & IRouterParamContext<any, IAppContext>, any>;
