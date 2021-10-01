import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to route details
 */
export class RoutesModule extends AppModule
{
    /**
     * Configures the module.
     */
    public configure(): void
    {
        /**
         * Will add a support note to the route
         * @returns 200 OK if support note is saved
         */
        this.router.post("/v2/routes/add-support-note", async context =>
        {
            await context.authorize("edit-routes");

            const body = context.request.body;
            body.fulfillerIds = [context.user?.organizationId];
            body.username = context.user?.id;

            const result = await this.apiClient.post("logistics-platform/routes/v3/add-support-note",
            {
                noi: true,
                body: body
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Will add a support note to the route
         * @returns 200 OK if support note is saved
         */
        this.router.post("/v2/routes/update", async context =>
        {
            await context.authorize("edit-routes");

            const body = context.request.body;
            body.fulfillerIds = [context.user?.organizationId];

            const result = await this.apiClient.post("logistics-platform/routes/v4/update-route",
            {
                noi: true,
                body: body
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Updated the status of the route
         * @returns 200 OK if added
         */
        this.router.post("/v2/routes/update-status", async context =>
        {
            await context.authorize("edit-routes");

            const body = context.request.body;
            body.fulfillerIds = [context.user?.organizationId];

            const result = await this.apiClient.post("logistics-platform/routes/v4/update-status",
            {
                noi: true,
                body: body
            });

            context.response.body = result.data;
            context.response.status = 200;
        });
    }
}
