import { Middleware } from "koa";
import cls from "cls-hooked";
import uuid from "uuid";

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
        const correlationId = context.request.headers["x-correlation"] || uuid.v4();
        const localeCode = context.request.headers["x-locale"];
        const currencyCode = context.request.headers["x-currency"];

        return new Promise(namespace.bind((resolve, reject) =>
        {
            namespace.bindEmitter(context.req);
            namespace.bindEmitter(context.res);

            namespace.set("headers-middleware",
            {
                correlationId,
                localeCode,
                currencyCode
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
