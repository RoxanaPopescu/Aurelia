import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to routes.
 */
export class RouteTemplatesModule extends AppModule
{
    public configure(): void
    {
        /**
         * Gets the route with the specified ID.
         * @param context.params.id The ID of the route to get.
         * @returns The route with the specified ID.
         */
        this.router.post("/v2/routes/templates/list", async context =>
        {
            context.authorize("view-route-templates");

            const result = await this.apiClient.post("routetemplate/List",
            {
                body:
                {
                    ownerId: context.user?.outfitId
                }
            });

            context.internal();

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Returns a single route template
         * @returns 200 ok
         */
        this.router.post("/v2/routes/templates/details", async context =>
        {
            context.authorize("view-route-templates");

            let body = context.request.body;
            body.ownerId = context.user?.outfitId;

            const routesResult = await this.apiClient.post("routetemplate/details",
            {
                body: body
            });

            context.internal();

            context.response.body = routesResult.data;
            context.response.status = 200;
        });

        /**
         * Creates a route template
         * @returns The id and slug of the new template
         */
        this.router.post("/v2/routes/templates/create", async context =>
        {
            context.authorize("create-route-template");

            let body = context.request.body;
            body.ownerId = context.user?.outfitId;
            body.lastModifiedById = context.user?.id;

            const routesResult = await this.apiClient.post("routetemplate/create",
            {
                body: body
            });

            context.internal();

            context.response.body = routesResult.data;
            context.response.status = 200;
        });

        /**
         * Creates a route template
         * @returns The id and slug of the new template
         */
        this.router.post("/v2/routes/templates/update", async context =>
        {
            context.authorize("create-route-template");

            let body = context.request.body;
            body.ownerId = context.user?.outfitId;
            body.lastModifiedById = context.user?.id;

            const routesResult = await this.apiClient.post("routetemplate/update",
            {
                body: body
            });

            context.internal();

            context.response.body = routesResult.data;
            context.response.status = 200;
        });
    }
}
