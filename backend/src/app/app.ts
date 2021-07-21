import * as Sentry from "@sentry/node";
import Koa from "koa";
import koaConditionalGet from "koa-conditional-get";
import koaEtag from "koa-etag";
import koaCompress from "koa-compress";
import koaBodyparser from "koa-bodyparser";
import { environment } from "../env";
import { inject } from "../shared/infrastructure";
import settings from "../resources/settings/settings";
import { AppRouter } from "./app-router";
import { IAppContext } from "./app-context";
import { logErrorMiddleware } from "./middleware/log-error-middleware";
import { apiErrorMiddleware } from "./middleware/api-error-middleware";
import { headersMiddleware } from "./middleware/headers-middleware";
import { authorizeMiddleware } from "./middleware/authorize-middleware";
import { pagingMiddleware } from "./middleware/paging-middleware";
import { sortingMiddleware } from "./middleware/sorting-middleware";

// Configure sentry
Sentry.init({
    dsn: environment.sentryDns,
    environment: environment.name,
    tracesSampleRate: 0.8
});

/**
 * Represents the app.
 */
@inject
export class App extends Koa<any, IAppContext>
{
    /**
     * Creates a new instance of the type.
     * @param appRouter The `AppRouter` instance.
     */
    public constructor(appRouter: AppRouter)
    {
        super();

        this._appRouter = appRouter;

        // Send errors to sentry
        this.on("error", (err, ctx) =>
        {
            Sentry.withScope(scope =>
            {
                scope.addEventProcessor(event =>
                {

                    return Sentry.Handlers.parseRequest(event, ctx.request);
                });

                Sentry.captureException(err);
            });
        });
    }

    private readonly _appRouter: AppRouter;

    /**
     * Configures the instance.
     * @returns The instance.
     */
    public configure(): this
    {
        // Add standard middleware.
        this.use(koaConditionalGet());
        this.use(koaEtag());
        this.use(koaCompress());
        this.use(koaBodyparser({enableTypes: ["json"]}));

        // Add custom middleware.
        this.use(logErrorMiddleware());
        this.use(headersMiddleware());
        this.use(apiErrorMiddleware());
        this.use(authorizeMiddleware(settings.middleware.identity.accessToken));
        this.use(pagingMiddleware());
        this.use(sortingMiddleware());

        // Add router middleware.
        this.use(this._appRouter.routes());
        this.use(this._appRouter.allowedMethods());

        return this;
    }

    /**
     * Starts the app.
     */
    public start(): void
    {
        this.listen(environment.port, () =>
        {
            console.info(`Server running in '${environment.name}' environment, listening on port ${environment.port}`);
        });
    }
}
