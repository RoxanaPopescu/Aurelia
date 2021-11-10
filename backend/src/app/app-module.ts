import { Next } from "koa";
import { ApiClient, inject } from "../shared/infrastructure";
import { AppContext } from "./app-context";
import { AppRouter } from "./app-router";

/**
 * Represents the name of an endpoint defined on a module.
 */
export type EndpointName = `${"HEAD" | "GET" | "POST" | "PUT" | "PATCH" | "DELETE"} /${string}`;

// Map that associates configured endpoints with their handler functions.
const _configuredEndpoints = new Map<EndpointName, (context: AppContext, next: Next) => void | Promise<void>>();

/**
 * Gets the function configured as the handler for the specified endpoint.
 *
 * Note that only endpoints that are defined as methods on a module class are supported.
 * Endpoints that are manually added to the router are not supported.
 *
 * @param endpoint The name of the endpoint, which must match the pattern `{HEAD|GET|POST|PUT|PATCH|DELETE} /{path}`.
 * @returns The function configured as the handler for the specified endpoint.
 */
export function getEndpoint(endpoint: EndpointName): (context: AppContext, next: Next) => void | Promise<void>
{
    const endpointFunc = _configuredEndpoints.get(endpoint);

    if (endpointFunc == null)
    {
        throw new Error(`The endpoint '${endpoint}' has not been configured.`);
    }

    return endpointFunc;
}

/**
 * Represents the base class from which all app modules must inherit.
 */
@inject
export abstract class AppModule
{
    /**
     * Configures the module.
     * @param router The `KoaRouter` instance.
     * @param apiClient The `ApiClient` instance.
     */
    public constructor(router: AppRouter, apiClient: ApiClient)
    {
        this.apiClient = apiClient;
        this.router = router;
    }

    /**
     * The `ApiClient` instance.
     */
    protected apiClient: ApiClient;

    /**
     * The `AppRouter` instance.
     */
    protected router: AppRouter;

    /**
     * Configures the module.
     * By default, this registers a route for any method in the class,
     * whose name matches the pattern `{HEAD|GET|POST|PUT|PATCH|DELETE} /{path}`
     */
    public configure(): void
    {
        // tslint:disable-next-line: no-this-assignment
        let object: any = this;

        while (object != null)
        {
            for (const key of Reflect.ownKeys(object))
            {
                if (typeof key === "string")
                {
                    const match = key.match(/^(?<verb>HEAD|GET|POST|PUT|PATCH|DELETE)(?<space>\s+)(?<path>.*)/);

                    if (match != null)
                    {
                        const [_, verb, space, path] = match;

                        if (/[a-z]/.test(verb))
                        {
                            throw new Error(`The HTTP verb in '${key}' must be upper-case.`);
                        }

                        if (space.length !== 1)
                        {
                            throw new Error(`The HTTP verb in '${key}' must be followed by a single space.`);
                        }

                        if (!path.startsWith("/"))
                        {
                            throw new Error(`The path in '${key}' must start with a single '/'.`);
                        }

                        if (/\/\/|\s|\?|#/.test(path))
                        {
                            throw new Error(`The path in '${key}' is not valid.`);
                        }

                        if (!(object[key] instanceof Function))
                        {
                            throw new Error(`The class member '${key}' must be a function.`);
                        }

                        const endpointFunc = (this as any)[key].bind(this);

                        (this.router as any)[verb.toLowerCase()](path, endpointFunc);

                        _configuredEndpoints.set(key as EndpointName, endpointFunc);
                    }
                }
            }

            object = Reflect.getPrototypeOf(object);
        }
    }

    /**
     * Handles requests for the endpoint specified by the method name.
     */
    [key: EndpointName]: (context: AppContext, next: Next) => void | Promise<void>;
}
