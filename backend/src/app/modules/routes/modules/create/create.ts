import { v4 as uuidV4 } from "uuid";
import { AppContext } from "../../../../app-context";
import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to creating routes.
 */
export class RouteCreateModule extends AppModule
{
    /**
     * Creates a route from orders.
     * @returns 200 OK
     */
    public "POST /v2/routes/create/from-orders" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        const routesResult = await this.apiClient.post("routeoptimizationorchestrator/CreateRouteFromOrders",
        {
            body:
            {
                ...context.request.body,
                id: uuidV4(),
                ownerId: context.user?.organizationId,
                actionById: context.user?.id
            }
        });

        context.response.body = routesResult.data;
        context.response.status = 200;
    }

    /**
     * Creates a route from a template.
     * @returns The ID and slug of the new route.
     */
    public "POST /v2/routes/create/collection-points-from-orders" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        const routesResult = await this.apiClient.post("routeoptimizationorchestrator/CreateRouteWithCollectionPointsFromOrders",
        {
            body:
            {
                ...context.request.body,
                ownerId: context.user?.organizationId,
                actionById: context.user?.id
            }
        });

        context.response.body = routesResult.data;
        context.response.status = 200;
    }

    /**
     * Creates a route from a template.
     * @returns The ID and slug of the new route.
     */
    public "POST /v2/routes/create/from-template" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        const routesResult = await this.apiClient.post("route-template-orchestrator/create-route",
        {
            body:
            {
                ...context.request.body,
                ownerId: context.user?.organizationId,
                actionById: context.user?.id
            }
        });

        context.response.body = routesResult.data;
        context.response.status = 200;
    }
}
