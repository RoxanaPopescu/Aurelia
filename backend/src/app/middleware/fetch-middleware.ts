import { Middleware } from "koa";
import { IAppContext, AppContext } from "../../app/app-context";
import { EndpointName, getEndpoint } from "../../app/app-module";

/**
 * Creates a new middlerware instance, that adds a `fetch` method
 * to the context, which can be used to make an internal request
 * to another endpoint.
 *
 * Note that only endpoints that are defined as methods on the
 * module are supported; endpoints that are manually added to
 * the router are not.
 *
 * Also note that no `next` method will be provided to the endpoint,
 * and that the context provided will not be a real context instance,
 * but a fake instance with only the the most essential properties.
 */
export function fetchMiddleware(): Middleware<any, IAppContext>
{
    return async (context, next) =>
    {
        // Add the `fetch` method to the context.
        context.fetch = async function fetch(endpoint: EndpointName, request?: IFakeRequest): Promise<IFakeResponse>
        {
            const endpointFunc = getEndpoint(endpoint);

            const fakeContext: IFakeContext =
            {
                // tslint:disable: no-unbound-method
                user: context.user,
                paging: context.paging,
                sorting: context.sorting,
                authorize: context.authorize,
                internal: context.internal,
                fetch: context.fetch,
                // tslint:enable

                headers: request?.headers ?? context.headers,
                query: request?.query ?? {},
                params: request?.params ?? {},
                request:
                {
                    headers: request?.headers ?? context.headers,
                    query: request?.query ?? {},
                    body: request?.body ?? {}
                },

                response:
                {
                    status: undefined as any,
                    body: undefined as any
                }
            };

            // tslint:disable-next-line: ban-types
            await (endpointFunc as Function)(fakeContext);

            return fakeContext.response;
        };

        await next();
    };
}

/**
 * Represents the fake request to use when executing an internal fetch.
 */
export interface IFakeRequest
{
    headers?: AppContext["headers"];
    params?: AppContext["params"];
    query?: AppContext["query"];
    body?: AppContext["request"]["body"];
}

/**
 * Represents the fake response produced when executing an internal fetch.
 */
export interface IFakeResponse
{
    status: AppContext["response"]["status"];
    body: AppContext["response"]["body"];
}

/**
 * Represents the fake context passed to a endpoint when executing an internal fetch.
 */
export interface IFakeContext extends IAppContext
{
    headers: AppContext["headers"];
    query: AppContext["query"];
    params: AppContext["params"];
    request:
    {
        headers: AppContext["request"]["headers"];
        query: AppContext["request"]["query"];
        body: AppContext["request"]["body"];
    };
    response: IFakeResponse;
}
