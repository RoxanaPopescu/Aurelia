import { AppContext } from "../../../../app-context";
import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to route stops
 */
export class RoutesStopsModule extends AppModule
{
    /**
     * Add one stop to the route at a specific index
     * @returns 200 OK if added
     */
    public "POST /v2/routes/stops/add" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        const body = context.request.body;
        body.fulfillerIds = [context.user?.organizationId];

        const result = await this.apiClient.post("logistics-platform/routes/v3/add-stop",
        {
            noi: true,
            body: body
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Starts a service
     * @returns 204 No content
     */
    public "POST /v5/routes/stops/start-service" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        await this.apiClient.post("logistics-platform/routes/v5/start-service",
        {
            noi: true,
            body: {
                ...context.request.body
            }
        });

        context.response.status = 204;
    }

    /**
     * Update one stop to the route at a specific route
     * @returns 200 OK if added
     */
    public "POST /v2/routes/stops/update" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        const body = context.request.body;
        body.fulfillerIds = [context.user?.organizationId];

        const result = await this.apiClient.post("logistics-platform/routes/v3/update-stop",
        {
            noi: true,
            body: body
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Switch the order of two stops
     * @returns 200 OK if added
     */
    public "POST /v2/routes/stops/move" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        const body = context.request.body;
        body.fulfillerIds = [context.user?.organizationId];

        const result = await this.apiClient.post("logistics-platform/routes/v3/move-stop",
        {
            noi: true,
            body: body
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Switch the order of two stops
     * @returns 200 OK if service is started
     */
    public "POST /v2/routes/stops/start-service" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        const result = await this.apiClient.post("logistics-platform/routes/v5/start-service",
        {
            noi: true,
            body: context.request.body
        });

        context.response.body = result.data;
        context.response.status = 200;
    }
}
