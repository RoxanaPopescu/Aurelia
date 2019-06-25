import { ApiClient } from "../../../shared/infrastructure";
import { AppRouter } from "../../app-router";

/**
 * Configures the module.
 * @param router The `KoaRouter` instance.
 * @param apiClient The `ApiClient` instance.
 */
export function configure(router: AppRouter, apiClient: ApiClient): void
{
    /**
     * Gets the depot with the specified ID.
     * @param context.params.id The ID of the depot to get.
     * @returns The depot with the specified ID.
     */
    router.get("/depots/:id", async context =>
    {
        context.authorize("view-depots");

        const depotResult = await apiClient.post("depots/details",
        {
            body:
            {
                id: context.params.id
            }
        });

        context.response.body = depotResult.data;
        context.response.status = 200;
    });

    /**
     * Gets the route with the specified ID.
     * @param context.params.id The ID of the route to get.
     * @returns The route with the specified ID.
     */
    router.get("/route/:id", async context =>
    {
        context.authorize("view-routes");

        const routeResult = await apiClient.get(`routes/${context.params.id}`);
        const route = routeResult.data;

        context.internal();

        const fulfillerResult = await apiClient.get(`fulfillers/${route.fulfillerId}`);
        const fulfiller = fulfillerResult.data;

        route.fulfiller = fulfiller;
        delete route.fulfillerId;

        context.response.body = route;
        context.response.status = 200;
    });

    /**
     * Gets the routes relevant to the user.
     * @returns The routes relevant to the user.
     */
    router.get("/routes", async context =>
    {
        context.authorize("view-routes");

        const routesResult = await apiClient.post("routes/query",
        {
            body:
            {
                paging: context.paging,
                sorting: context.sorting
            }
        });

        context.internal();

        const fulfillersResult = await apiClient.post("fulfillers/query",
        {
            body:
            {
                ids: routesResult.data.map((r: any) => r.fulfillerId)
            }
        });

        for (const route of routesResult.data)
        {
            route.fulfiller = fulfillersResult.data.unshift();
            delete route.fulfillerId;
        }

        context.response.body = routesResult.data;
        context.response.status = 200;
    });

    /**
     * Gets the routes matching the specified query.
     * @returns The routes matching the specified query.
     */
    router.post("/routes/query", async context =>
    {
        context.authorize("view-routes");

        const routesResult = await apiClient.post("routes/query",
        {
            body:
            {
                ids: context.request.body.ids,

                paging: context.paging,
                sorting: context.sorting
            }
        });

        context.internal();

        const fulfillersResult = await apiClient.post("fulfillers/query",
        {
            body:
            {
                ids: routesResult.data.map((r: any) => r.fulfillerId)
            }
        });

        for (const route of routesResult.data)
        {
            route.fulfiller = fulfillersResult.data.unshift();
            delete route.fulfillerId;
        }

        context.response.body = routesResult.data;
        context.response.status = 200;
    });
}
