import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to creating routes.
 */
export class RouteCreateModule extends AppModule
{
    public configure(): void
    {
        /**
         * Creates a route from a template.
         * @returns The ID and slug of the new route.
         */
        this.router.post("/v2/routes/create/collection-points-from-orders", async context =>
        {
            await context.authorize("edit-routes");

            const routesResult = await this.apiClient.post("routeoptimizationorchestrator/CreateRouteWithCollectionPointsFromOrders",
            {
                body:
                {
                    ...context.request.body,
                    ownerId: context.user?.organizationId,
                    actionById: context.user?.id
                }
            });

            context.response.body = routesResult.data;
            context.response.status = 200;
        });

        /**
         * Creates a route from a template.
         * @returns The ID and slug of the new route.
         */
        this.router.post("/v2/routes/create/from-template", async context =>
        {
            await context.authorize("create-route-template");

            const routesResult = await this.apiClient.post("route-template-orchestrator/create-route",
            {
                body:
                {
                    ...context.request.body,
                    ownerId: context.user?.organizationId,
                    actionById: context.user?.id
                }
            });

            context.response.body = routesResult.data;
            context.response.status = 200;
        });
    }
}
