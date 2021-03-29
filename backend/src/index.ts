import { environment } from "./env";
import * as Sentry from "@sentry/node";
import { container, ApiClient, RequestHeadersInterceptor, ResponseStubInterceptor } from "./shared/infrastructure";
import { getRequestHeaders } from "./app/middleware/headers-middleware";
import { App } from "./app/app";
import { AppRouter } from "./app/app-router";
import settings from "./resources/settings/settings";

// Configure sentry
Sentry.init({
    dsn: environment.sentryDns,
    environment: environment.name,
    tracesSampleRate: 0.8,
});

// Add and configure the interceptors used by the API client.
settings.infrastructure.api.interceptors.push(new RequestHeadersInterceptor(() => getRequestHeaders()));

if (environment.stubs)
{
    // tslint:disable-next-line: no-require-imports no-var-requires
    const { stubs } = require("./resources/stubs");
    settings.infrastructure.api.interceptors.push(new ResponseStubInterceptor(stubs));
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
