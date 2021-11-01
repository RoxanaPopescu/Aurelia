import { AppModule } from "../../../../app-module";
import { v4 as uuidV4 } from "uuid";

/**
 * Represents a module exposing endpoints related to route list
 */
export class DispatchRouteModule extends AppModule
{
    /**
     * Configures the module.
     */
    public configure(): void
    {
        /**
         * Assigns a driver
         * @returns 200 OK if successfull
         */
        this.router.post("/v2/dispatch/route/assign-driver", async context =>
        {
            await context.authorize("assign-driver-route");

            const body: any = context.request.body;
            body.fulfillerIds = [context.user?.organizationId];
            body.createdBy = context.user?.id;

            const result = await this.apiClient.post("logistics-platform/routes/v4/assign-driver",
            {
                noi: true,
                body: body
            });

            const data = result.data;
            context.response.body = data;
            context.response.status = 200;
        });

        /**
         * Assigns a vehicle
         * @returns 200 OK if successfull
         */
        this.router.post("/v2/dispatch/route/assign-vehicle", async context =>
        {
            await context.authorize("edit-routes");

            const body: any = context.request.body;
            body.fulfillerIds = [context.user?.organizationId];
            body.createdBy = context.user?.id;

            const result = await this.apiClient.post("logistics-platform/routes/v3/assign-vehicle",
            {
                noi: true,
                body: body
            });

            const data = result.data;
            context.response.body = data;
            context.response.status = 200;
        });

        /**
         * Assigns a executor
         * @returns 200 OK if successfull
         */
        this.router.post("/v2/dispatch/route/assign-executor", async context =>
        {
            await context.authorize("edit-routes");

            const result = await this.apiClient.post("logistics-platform/routes/v2/add-fulfiller",
            {
                noi: true,
                body: {
                    organizationId: context.user?.organizationId,
                    createdBy: context.user?.id,
                    routeId: context.request.body.routeId,
                    newFulfillerId: context.request.body.newExecutorId,
                    currentFulfillerId: context.request.body.currentExecutorId,
                    correlationId: uuidV4()
                }
            });

            const data = result.data;
            context.response.body = data;
            context.response.status = 200;
        });

        /**
         * Sends a push message to 1...x drivers about an available route
         * @returns 200 OK if successfull
         */
        this.router.post("/v2/dispatch/route/push-drivers", async context =>
        {
            await context.authorize("edit-routes");

            const body: any = context.request.body;
            body.fulfillerIds = [context.user?.organizationId];
            body.currentOutfit = context.user?.organizationId;
            body.createdBy = context.user?.id;

            const result = await this.apiClient.post("logistics-platform/routes/v4/push-route",
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
