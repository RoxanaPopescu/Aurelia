import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to routes.
 */
export class RoutesModule extends AppModule
{
    public configure(): void
    {
        /**
         * Gets the route with the specified ID.
         * @param context.params.id The ID of the route to get.
         * @returns The route with the specified ID.
         */
        this.router.get("/v2/routes/:id", async context =>
        {
            context.authorize("view-routes");

            const routeResult = await this.apiClient.get(`routes/${context.params.id}`);
            const route = routeResult.data;

            context.internal();

            const fulfillerResult = await this.apiClient.get(`fulfillers/${route.fulfillerId}`);
            const fulfiller = fulfillerResult.data;

            route.fulfiller = fulfiller;
            delete route.fulfillerId;

            context.response.body = route;
            context.response.status = 200;
        });

        /**
         * Gets the routes relevant to the user.
         * @returns The routes relevant to the user.
         */
        this.router.get("/v2/routes", async context =>
        {
            context.authorize("view-routes");

            const routesResult = await this.apiClient.post("routes/query",
            {
                body:
                {
                    paging: context.paging,
                    sorting: context.sorting
                }
            });

            context.internal();

            const fulfillersResult = await this.apiClient.post("fulfillers/query",
            {
                body:
                {
                    ids: routesResult.data.map((r: any) => r.fulfillerId)
                }
            });

            for (const route of routesResult.data)
            {
                route.fulfiller = fulfillersResult.data.unshift();
                delete route.fulfillerId;
            }

            context.response.body = routesResult.data;
            context.response.status = 200;
        });

        /**
         * Gets the routes matching the specified query.
         * @returns The routes matching the specified query.
         */
        this.router.post("/v2/routes/query", async context =>
        {
            context.authorize("view-routes");

            const routesResult = await this.apiClient.post("routes/query",
            {
                body:
                {
                    ids: context.request.body.ids,

                    paging: context.paging,
                    sorting: context.sorting
                }
            });

            context.internal();

            const fulfillersResult = await this.apiClient.post("fulfillers/query",
            {
                body:
                {
                    ids: routesResult.data.map((r: any) => r.fulfillerId)
                }
            });

            for (const route of routesResult.data)
            {
                route.fulfiller = fulfillersResult.data.unshift();
                delete route.fulfillerId;
            }

            context.response.body = routesResult.data;
            context.response.status = 200;
        });

        /**
         * Creates a route template
         * @returns The id and slug of the new template
         */
        this.router.post("/v2/routes/create-from-template", async context =>
        {
            context.authorize("create-route-template");

            const routesResult = await this.apiClient.post("route-template-orchestrator/CreateRoute",
            {
                body:
                {
                    ...context.request.body,
                    ownerId: context.user?.outfitId,
                    changedById: context.user?.id
                }
            });

            context.response.body = routesResult.data;
            context.response.status = 200;
        });
    }
}
