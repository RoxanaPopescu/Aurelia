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
            body.changedById = context.user?.id;

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
            body.changedById = context.user?.id;

            const routesResult = await this.apiClient.post("routetemplate/update",
            {
                body: body
            });

            context.internal();

            context.response.body = routesResult.data;
            context.response.status = 200;
        });

        /**
         * Deletes a route template
         * @returns The id and slug of the new template
         */
        this.router.post("/v2/routes/templates/delete", async context =>
        {
            context.authorize("create-route-template");

            let body = context.request.body;
            body.ownerId = context.user?.outfitId;
            body.changedById = context.user?.id;

            await this.apiClient.post("routetemplate/delete",
            {
                body: body
            });

            context.internal();

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
            body.changedById = context.user?.id;

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
        this.router.post("/v2/routes/templates/stops/add", async context =>
        {
            context.authorize("create-route-template");

            let body = context.request.body;
            body.ownerId = context.user?.outfitId;
            body.changedById = context.user?.id;

            const routesResult = await this.apiClient.post("routetemplate/stops/add",
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
        this.router.post("/v2/routes/templates/stops/move", async context =>
        {
            context.authorize("create-route-template");

            let body = context.request.body;
            body.ownerId = context.user?.outfitId;
            body.changedById = context.user?.id;

            const routesResult = await this.apiClient.post("routetemplate/stops/move",
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
        this.router.post("/v2/routes/templates/stops/update", async context =>
        {
            context.authorize("create-route-template");

            let body = context.request.body;
            body.ownerId = context.user?.outfitId;
            body.changedById = context.user?.id;

            const routesResult = await this.apiClient.post("routetemplate/stops/update",
            {
                body: body
            });

            context.internal();

            context.response.body = routesResult.data;
            context.response.status = 200;
        });

        /**
         * Deletes a route template
         * @returns The id and slug of the new template
         */
        this.router.post("/v2/routes/templates/stops/delete", async context =>
        {
            context.authorize("create-route-template");

            let body = context.request.body;
            body.ownerId = context.user?.outfitId;
            body.changedById = context.user?.id;

            await this.apiClient.post("routetemplate/stops/delete",
            {
                body: body
            });

            context.internal();

            context.response.status = 200;
        });

        /**
         * Creates a schedule
         * @returns The id and slug of the new schedule
         */
        this.router.post("/v2/routes/templates/schedules/add", async context =>
        {
            context.authorize("create-route-template");

            let body = context.request.body;
            body.ownerId = context.user?.outfitId;
            body.changedById = context.user?.id;

            const routesResult = await this.apiClient.post("routetemplate/schedules/add",
            {
                body: body
            });

            context.internal();

            context.response.body = routesResult.data;
            context.response.status = 200;
        });

        /**
         * Updated a schedule
         * @returns The updated schedule
         */
        this.router.post("/v2/routes/templates/schedules/update", async context =>
        {
            context.authorize("create-route-template");

            let body = context.request.body;
            body.ownerId = context.user?.outfitId;
            body.changedById = context.user?.id;

            const routesResult = await this.apiClient.post("routetemplate/schedules/update",
            {
                body: body
            });

            context.internal();

            context.response.body = routesResult.data;
            context.response.status = 200;
        });

        /**
         * Deletes a route template schedule
         */
        this.router.post("/v2/routes/templates/schedules/delete", async context =>
        {
            context.authorize("create-route-template");

            let body = context.request.body;
            body.ownerId = context.user?.outfitId;
            body.changedById = context.user?.id;

            await this.apiClient.post("routetemplate/schedules/delete",
            {
                body: body
            });

            context.internal();

            context.response.status = 200;
        });
    }
}
