import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to communication.
 */
export class DriversModule extends AppModule
{
    public configure(): void
    {
        /**
         * Gets the drivers for an organization
         * @returns The a list of drivers.
         */
        this.router.post("/v2/drivers/list", async context =>
        {
            await context.authorize("view-drivers");

            const body = context.request.body;
            body.outfitIds = [context.user?.organizationId];

            const result = await this.apiClient.post("logistics-platform/drivers/list-v2",
            {
                noi: true,
                body: body
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Updated the password for a driver
         * @returns 200 OK.
         */
        this.router.post("/v2/drivers/set-password", async context =>
        {
            await context.authorize("edit-driver");

            const body = context.request.body;

            const result = await this.apiClient.post("logistics-platform/drivers/set-password",
            {
                noi: true,
                body: {
                    fulfillerId: context.user?.organizationId,
                    driverId: body.id,
                    password: body.newPassword,
                    actionBy: context.user?.id
                }
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Gets the driver by ID.
         * @param context.params.id The ID of the driver to receive.
         * @returns The driver of the specified ID.
         */
        this.router.get("/v2/drivers/:id", async context =>
        {
            await context.authorize("view-drivers");

            const result = await this.apiClient.get("logistics-platform/drivers/details",
            {
                query: {
                    driverId: context.params.id,
                    fulfillerId: context.user?.organizationId
                },
                noi: true
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Updates a driver
         * @returns 200 OK.
         */
        this.router.post("/v2/drivers/update", async context =>
        {
            await context.authorize("edit-driver");

            const body = { driver: context.request.body, fulfillerId: context.user?.organizationId };

            const result = await this.apiClient.post("logistics-platform/drivers/update",
            {
                noi: true,
                body: body
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

         /**
          * Creates a driver
          * @returns 200 OK.
          */
        this.router.post("/v2/drivers/create", async context =>
        {
            await context.authorize("edit-driver");

            const body = { driver: context.request.body, fulfillerId: context.user?.organizationId };

            try
            {
                const result = await this.apiClient.post("logistics-platform/drivers/create",
                {
                    noi: true,
                    body: body
                });

                context.response.body = result.data;
                context.response.status = 200;
            }
            catch (error: any)
            {
                if (error.data?.status === 103)
                {
                    context.response.status = 409;
                }
            }
        });

         /**
          * Deletes a driver
          * @returns 200 OK.
          */
        this.router.post("/v2/drivers/delete", async context =>
        {
            await context.authorize("edit-driver");

            const body = { driverId: context.request.body.id, fulfillerId: [context.user?.organizationId] };

            const result = await this.apiClient.post("logistics-platform/drivers/delete",
            {
                noi: true,
                body: body
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Sends a message to a driver
         * @returns 200 OK if successfull
         */
        this.router.post("/v2/drivers/send-message", async context =>
        {
            await context.authorize();

            const body = context.request.body;
            body.executorId = context.user?.organizationId;

            const result = await this.apiClient.post("logistics-platform/drivers/send-message",
            {
                noi: true,
                body: body
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Returns online drivers in the specific area
         * @returns 200 OK if successfull
         */
        this.router.post("/v2/drivers/online-in-area", async context =>
        {
            await context.authorize();

            const body = context.request.body;
            body.fulfillerIds = [context.user?.organizationId];
            body.currentOutfit = context.user?.organizationId;

            const result = await this.apiClient.post("logistics-platform/drivers/online-in-area",
            {
                noi: true,
                body: body
            });

            context.response.body = result.data;
            context.response.status = 200;
        });
    }
}
