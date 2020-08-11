import { AppModule } from "../../../app-module";

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
        this.router.get("/v2/routes/templates/list", async context =>
        {
            context.authorize("view-route-templates");
            const routeResult = await this.apiClient.get("route-templates/list");
            context.internal();

            context.response.body = routeResult.data;
            context.response.status = 200;
        });

        /**
         * Gets the routes matching the specified query.
         * @returns The routes matching the specified query.
         */
        this.router.post("/v2/routes/templates/create", async context =>
        {
            context.authorize("view-routes");

            let body = context.request.body;
            body.ownerIds = [context.user?.outfitId];

            const routesResult = await this.apiClient.post("route-templates/create",
            {
                body: body
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
    }
}
