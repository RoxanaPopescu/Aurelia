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
            await context.authorize("view-route-templates");

            const result = await this.apiClient.post("routetemplate/List",
            {
                body:
                {
                    ownerId: context.user?.organizationId
                }
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Returns a single route template
         * @returns 200 ok
         */
        this.router.post("/v2/routes/templates/details", async context =>
        {
            await context.authorize("view-route-templates");

            const routesResult = await this.apiClient.post("routetemplate/details",
            {
                body:
                {
                    ...context.request.body,
                    ownerId: context.user?.organizationId
                }
            });

            context.response.body = routesResult.data;
            context.response.status = 200;
        });

        /**
         * Creates a route template
         * @returns The id and slug of the new template
         */
        this.router.post("/v2/routes/templates/create", async context =>
        {
            await context.authorize("create-route-template");

            const routesResult = await this.apiClient.post("routetemplate/create",
            {
                body:
                {
                    ...context.request.body,
                    ownerId: context.user?.organizationId,
                    changedById: context.user?.id
                }
            });

            context.response.body = routesResult.data;
            context.response.status = 200;
        });

        /**
         * Creates a route template
         * @returns The id and slug of the new template
         */
        this.router.post("/v2/routes/templates/update", async context =>
        {
            await context.authorize("create-route-template");

            const routesResult = await this.apiClient.post("routetemplate/update",
            {
                body:
                {
                    ...context.request.body,
                    ownerId: context.user?.organizationId,
                    changedById: context.user?.id
                }
            });

            context.response.body = routesResult.data;
            context.response.status = 200;
        });

        /**
         * Deletes a route template
         * @returns The id and slug of the new template
         */
        this.router.post("/v2/routes/templates/delete", async context =>
        {
            await context.authorize("create-route-template");

            await this.apiClient.post("routetemplate/delete",
            {
                body:
                {
                    ...context.request.body,
                    ownerId: context.user?.organizationId,
                    changedById: context.user?.id
                }
            });

            context.response.status = 200;
        });

        /**
         * Creates a route template
         * @returns The id and slug of the new template
         */
        this.router.post("/v2/routes/templates/create", async context =>
        {
            await context.authorize("create-route-template");

            const routesResult = await this.apiClient.post("routetemplate/create",
            {
                body:
                {
                    ...context.request.body,
                    ownerId: context.user?.organizationId,
                    changedById: context.user?.id
                }
            });

            context.response.body = routesResult.data;
            context.response.status = 200;
        });

        /**
         * Creates a route template
         * @returns The id and slug of the new template
         */
        this.router.post("/v2/routes/templates/stops/add", async context =>
        {
            await context.authorize("create-route-template");

            const routesResult = await this.apiClient.post("routetemplate/stops/add",
            {
                body:
                {
                    ...context.request.body,
                    ownerId: context.user?.organizationId,
                    changedById: context.user?.id
                }
            });

            context.response.body = routesResult.data;
            context.response.status = 200;
        });

        /**
         * Creates a route template
         * @returns The id and slug of the new template
         */
        this.router.post("/v2/routes/templates/stops/move", async context =>
        {
            await context.authorize("create-route-template");

            const routesResult = await this.apiClient.post("routetemplate/stops/move",
            {
                body:
                {
                    ...context.request.body,
                    ownerId: context.user?.organizationId,
                    changedById: context.user?.id
                }
            });

            context.response.body = routesResult.data;
            context.response.status = 200;
        });

        /**
         * Creates a route template
         * @returns The id and slug of the new template
         */
        this.router.post("/v2/routes/templates/stops/update", async context =>
        {
            await context.authorize("create-route-template");

            const routesResult = await this.apiClient.post("routetemplate/stops/update",
            {
                body:
                {
                    ...context.request.body,
                    ownerId: context.user?.organizationId,
                    changedById: context.user?.id
                }
            });

            context.response.body = routesResult.data;
            context.response.status = 200;
        });

        /**
         * Deletes a route template
         * @returns The id and slug of the new template
         */
        this.router.post("/v2/routes/templates/stops/delete", async context =>
        {
            await context.authorize("create-route-template");

            await this.apiClient.post("routetemplate/stops/delete",
            {
                body:
                {
                    ...context.request.body,
                    ownerId: context.user?.organizationId,
                    changedById: context.user?.id
                }
            });

            context.response.status = 200;
        });

        /**
         * Creates a schedule
         * @returns The id and slug of the new schedule
         */
        this.router.post("/v2/routes/templates/schedules/add", async context =>
        {
            await context.authorize("create-route-template");

            const routesResult = await this.apiClient.post("routetemplate/schedules/add",
            {
                body:
                {
                    ...context.request.body,
                    ownerId: context.user?.organizationId,
                    changedById: context.user?.id
                }
            });

            context.response.body = routesResult.data;
            context.response.status = 200;
        });

        /**
         * Updated a schedule
         * @returns The updated schedule
         */
        this.router.post("/v2/routes/templates/schedules/update", async context =>
        {
            await context.authorize("create-route-template");

            const routesResult = await this.apiClient.post("routetemplate/schedules/update",
            {
                body:
                {
                    ...context.request.body,
                    ownerId: context.user?.organizationId,
                    changedById: context.user?.id
                }
            });

            context.response.body = routesResult.data;
            context.response.status = 200;
        });

        /**
         * Deletes a route template schedule
         */
        this.router.post("/v2/routes/templates/schedules/delete", async context =>
        {
            await context.authorize("create-route-template");

            await this.apiClient.post("routetemplate/schedules/delete",
            {
                body:
                {
                    ...context.request.body,
                    ownerId: context.user?.organizationId,
                    changedById: context.user?.id
                }
            });

            context.response.status = 200;
        });
    }
}
