import { Middleware } from "koa";
import { v4 as uuidV4 } from "uuid";
import cls from "cls-hooked";
import { MapObject } from "shared/types";

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

            if (getRequestHeaders() != null)
            {
                throw new Error("Expected request headers to be undefined.");
            }

            setRequestHeaders(
            {
                authorization: context.request.headers["authorization"] as string,
                correlationId: context.request.headers["x-correlation"] as string || uuidV4(),
                apiKey: context.request.headers["x-api-key"] as string,
                visitorId: context.request.headers["x-visitor"] as string,
                sessionId: context.request.headers["x-session"] as string,
                instanceId: context.request.headers["x-instance"] as string,
                localeCode: context.request.headers["x-locale"] as string,
                marketCode: context.request.headers["x-market"] as string,
                currencyCode: context.request.headers["x-currency"] as string
            });

            return next().then(resolve).catch(reject);
        }));
    };
}

/**
 * Gets the headers for the request currently being handled,
 * or `undefined` if no request is currently being handled.
 */
export const getRequestHeaders = () =>
    namespace.get("headers-middleware") as MapObject<string | undefined>;

/**
 * Sets the headers for the request currently being handled,
 * merging the specified headers with any existing headers.
 */
export const setRequestHeaders = (headers: MapObject<string | undefined>) =>
    namespace.set("headers-middleware", { ...getRequestHeaders(), ...headers });
