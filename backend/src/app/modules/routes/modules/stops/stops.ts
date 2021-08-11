import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to route stops
 */
export class RoutesStopsModule extends AppModule
{
    /**
     * Configures the module.
     */
    public configure(): void
    {
        /**
         * Add one stop to the route at a specific index
         * @returns 200 OK if added
         */
        this.router.post("/v2/routes/stops/add", async context =>
        {
            await context.authorize("edit-routes");

            const body = context.request.body;
            body.fulfillerIds = [context.user?.outfitId];

            const result = await this.apiClient.post("logistics-platform/routes/v3/add-stop",
            {
                noi: true,
                body: body
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Update one stop to the route at a specific route
         * @returns 200 OK if added
         */
        this.router.post("/v2/routes/stops/update", async context =>
        {
            await context.authorize("edit-routes");

            const body = context.request.body;
            body.fulfillerIds = [context.user?.outfitId];

            const result = await this.apiClient.post("logistics-platform/routes/v3/update-stop",
            {
                noi: true,
                body: body
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Switch the order of two stops
         * @returns 200 OK if added
         */
        this.router.post("/v2/routes/stops/move", async context =>
        {
            await context.authorize("edit-routes");

            const body = context.request.body;
            body.fulfillerIds = [context.user?.outfitId];

            const result = await this.apiClient.post("logistics-platform/routes/v3/move-stop",
            {
                noi: true,
                body: body
            });

            context.response.body = result.data;
            context.response.status = 200;
        });
    }
}
