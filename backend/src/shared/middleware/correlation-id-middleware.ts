import { Middleware } from "koa";
import cls from "cls-hooked";
import uuid from "uuid";

// The continuation-local storage namespace for this middleware.
const namespace = cls.createNamespace("koa-correlation-id");

/**
 * Creates a new middlerware instance, that stores the correlation ID of
 * each request in continuation-local storage, thus making it available
 * even anywhere in the app. In your HTTP client of choice, you can then
 * use this to automatically add that same ID to any outgoing requests.
 */
export function correlationIdMiddleware(): Middleware
{
    const headerName = "correlation-id";

    return async (context, next) =>
    {
        const correlationId = context.request.headers[headerName] || uuid.v4();

        return new Promise(namespace.bind((resolve, reject) =>
        {
            namespace.bindEmitter(context.req);
            namespace.bindEmitter(context.res);

            namespace.set("correlation-id", correlationId);

            return next().then(resolve).catch(reject);
        }));
    };
}

/**
 * Gets the correlation ID of the request being handled, or `undefined`
 * if there is no request or the request has no correlation ID.
 */
export const getCorrelationId = () => namespace.get("correlation-id");
