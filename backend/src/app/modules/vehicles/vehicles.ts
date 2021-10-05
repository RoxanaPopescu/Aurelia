import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to tracking.
 */
export class VehiclesModule extends AppModule
{
    public configure(): void
    {
        /**
         * Gets the vehicles for an organization
         * @returns The a list of vehicle.
         */
        this.router.post("/v2/vehicles/list", async context =>
        {
            await context.authorize("view-vehicles");

            const body = context.request.body;
            body.accessIds = [context.user?.organizationId];

            const result = await this.apiClient.post("logistics-platform/vehicles/list",
            {
                noi: true,
                body: body
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Updates a vehicle
         * @returns 200 OK.
         */
        this.router.post("/v2/vehicles/update", async context =>
        {
            await context.authorize("create-vehicle");

            const body = context.request.body;
            body.accessIds = [context.user?.organizationId];

            const result = await this.apiClient.post("logistics-platform/vehicles/update",
            {
                noi: true,
                body: body
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Creates a vehicle
         * @returns 200 OK.
         */
        this.router.post("/v2/vehicles/create", async context =>
        {
            await context.authorize("create-vehicle");

            const body = context.request.body;
            body.accessIds = [context.user?.organizationId];
            body.outfitId = context.user?.organizationId;

            const result = await this.apiClient.post("logistics-platform/vehicles/create",
            {
                noi: true,
                body: body
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Deletes a vehicle
         * @returns 200 OK.
         */
        this.router.post("/v2/vehicles/delete", async context =>
        {
            await context.authorize("create-vehicle");

            const body = context.request.body;
            body.accessIds = [context.user?.organizationId];

            const result = await this.apiClient.post("logistics-platform/vehicles/delete",
            {
                noi: true,
                body: body
            });

            context.response.body = result.data;
            context.response.status = 200;
        });
    }
}
