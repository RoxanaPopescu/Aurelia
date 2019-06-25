import Koa from "koa";
import koaConditionalGet from "koa-conditional-get";
import koaEtag from "koa-etag";
import koaCompress from "koa-compress";
import koaBodyparser from "koa-bodyparser";
import { environment } from "../env";
import { inject } from "../shared/infrastructure";
import { errorHandler } from "../shared/middleware/error-handler";
import { koaCorrelationId } from "../shared/middleware/koa-correlation-id";
import { koaAuthorize } from "../shared/middleware/koa-authorize";
import { pagingAndSorting } from "../shared/middleware/paging-and-sorting";
import { AppRouter } from "./app-router";
import { IAppContext } from "./app-context";

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
    }

    private readonly _appRouter: AppRouter;

    /**
     * Configures the instance.
     * @returns The instance.
     */
    public configure(): this
    {
        // Add error handling middleware.
        this.use(errorHandler());

        // Add standard middleware.
        this.use(koaConditionalGet());
        this.use(koaEtag());
        this.use(koaCompress());
        this.use(koaBodyparser());

        // Add custom middleware.
        this.use(koaCorrelationId());
        this.use(koaAuthorize());
        this.use(pagingAndSorting());

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
