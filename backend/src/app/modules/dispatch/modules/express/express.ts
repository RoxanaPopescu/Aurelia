import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to route list
 */
export class RoutesListModule extends AppModule
{
    /**
     * Configures the module.
     */
    public configure(): void
    {
        /**
         * Get the list of driver routes
         * @returns list of driver routes
         */
        this.router.get("/v2/dispatch/express/driver-routes", async context =>
        {
            context.authorize("view-routes");

            const query = context.request.query;
            query.AccessOutfits = [context.user?.outfitId];

            const result = await this.apiClient.post("logistics-platform/express-dispatch/driver-routes",
            {
                noi: true,
                body: query
            });

            const data = result.data;

            context.response.body = data;
            context.response.status = 200;
        });

        /**
         * Get the list of new routes
         * @returns list of new routes
         */
        this.router.get("/v2/dispatch/express/new-routes", async context =>
        {
            context.authorize("view-routes");

            const query = context.request.query;
            query.AccessOutfits = [context.user?.outfitId];

            const result = await this.apiClient.post("logistics-platform/express-dispatch/new-routes",
            {
                noi: true,
                body: query
            });

            const data = result.data;

            context.response.body = data;
            context.response.status = 200;
        });

        /**
         * Will estimate one specific driver route
         * @returns estimates
         */
        this.router.post("/v2/dispatch/express/estimate-driver-route", async context =>
        {
            context.authorize("view-routes");

            const body = context.request.body;
            body.AccessOutfits = [context.user?.outfitId];
            body.driverId = 0; // Hack because it's required by the api, but not used.

            const result = await this.apiClient.post("logistics-platform/express-dispatch/estimate-driver-route",
            {
                noi: true,
                body: body
            });

            const data = result.data;

            context.response.body = data;
            context.response.status = 200;
        });

        /**
         * Release 1...x routes
         * @returns 200 OK
         */
        this.router.post("/v2/dispatch/express/release-routes", async context =>
        {
            context.authorize("edit-routes");

            const body = context.request.body;
            body.AccessOutfits = [context.user?.outfitId];

            const result = await this.apiClient.post("logistics-platform/express-dispatch/release-routes",
            {
                noi: true,
                body: body
            });

            const data = result.data;

            context.response.body = data;
            context.response.status = 200;
        });

        /**
         * Will add stops to a current driver route
         * @returns 200 OK
         */
        this.router.post("/v2/dispatch/express/update-driver-route", async context =>
        {
            context.authorize("edit-routes");

            const body = context.request.body;
            body.AccessOutfits = [context.user?.outfitId];
            body.driverId = 0; // Hack because it's required by the api, but not used.

            const result = await this.apiClient.post("logistics-platform/express-dispatch/update-driver-route",
            {
                noi: true,
                body: body
            });

            const data = result.data;

            context.response.body = data;
            context.response.status = 200;
        });
    }
}
