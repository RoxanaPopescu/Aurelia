import { environment } from "./env";
import { container, ApiClient, CorrelationIdInterceptor, StubInterceptor } from "./shared/infrastructure";
import { getCorrelationId } from "./shared/middleware/koa-correlation-id";
import { App } from "./app/app";
import { AppRouter } from "./app/app-router";
import settings from "./resources/settings";

// Add and configure the interceptors used by the API client.

settings.infrastructure.api.interceptors!.push(new CorrelationIdInterceptor(() => getCorrelationId()));

if (environment.stubs)
{
    // tslint:disable-next-line: no-require-imports no-var-requires
    const { stubs } = require("./resources/stubs");
    settings.infrastructure.api.interceptors!.push(new StubInterceptor(stubs));
}

// Add and configure the API client.
container
    .add(ApiClient)
    .get(ApiClient)
    .configure(settings.infrastructure.api);

// Add and configure the app router.
container
    .add(AppRouter)
    .get(AppRouter)
    .configure();

// Add, configure and start the app.
container
    .add(App)
    .get(App)
    .configure()
    .start();
