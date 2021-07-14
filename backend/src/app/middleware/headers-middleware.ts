import { Middleware } from "koa";
import { v4 as uuidV4 } from "uuid";
import cls from "cls-hooked";

// The continuation-local storage namespace for this middleware.
const namespace = cls.createNamespace("headers-middleware");

/**
 * Creates a new middlerware instance, that stores the headers of each
 * request in continuation-local storage, thus making them available
 * anywhere in the app. In your HTTP client of choice, you can then use
 * this to automatically add the same headers to any upstream requests.
 */
export function headersMiddleware(): Middleware
{
    return async (context, next) =>
    {
        return new Promise(namespace.bind((resolve, reject) =>
        {
            namespace.bindEmitter(context.req);
            namespace.bindEmitter(context.res);

            namespace.set("headers-middleware",
            {
                authorization: context.request.headers["authorization"],
                correlationId: context.request.headers["x-correlation"] || uuidV4(),
                apiKey: context.request.headers["x-api-key"],
                visitorId: context.request.headers["x-visitor"],
                sessionId: context.request.headers["x-session"],
                instanceId: context.request.headers["x-instance"],
                localeCode: context.request.headers["x-locale"],
                marketCode: context.request.headers["x-market"],
                currencyCode: context.request.headers["x-currency"]
            });

            return next().then(resolve).catch(reject);
        }));
    };
}

/**
 * Gets the headers for the request currently being handled,
 * or `undefined` if no request is currently being handled.
 */
export const getRequestHeaders = () => namespace.get("headers-middleware");
