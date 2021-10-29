import { AppContext } from "app/app-context";
import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to tracking.
 */
export class RoutePlanningPlansModule extends AppModule
{
    /**
     * Gets the jobs for automatic dispatch
     * @returns The a list of jobs.
     */
    public "POST /v2/route-planning/plans/list" = async (context: AppContext) =>
    {
        await context.authorize("view-routeplans");

        const body = context.request.body;
        body.outfitIds = [context.user?.organizationId];

        const result = await this.apiClient.post("routeoptimization/list",
        {
            body: body
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Approves a routeplan
     * @param context.params.id The id of the route plan to approve.
     * @returns 200 OK.
     */
    public "POST /v2/route-planning/plans/:id/approve" = async (context: AppContext) =>
    {
        await context.authorize("edit-routeplans");

        const result = await this.apiClient.post("routeoptimization/approve",
        {
            body:
            {
                id: context.params.id,
                changedBy: context.user?.id,
                outfitIds: [context.user?.organizationId]
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Gets one specific route plan
     * @param context.params.id The id of the route plan to receive.
     * @returns The route plan
     */
    public "GET /v2/route-planning/plans/:id" = async (context: AppContext) =>
    {
        await context.authorize("view-routeplans");

        const result = await this.apiClient.post("routeoptimization/result",
        {
            body:
            {
                outfitIds: [context.user?.organizationId],
                id: context.params.id
            }
        });

        const routeplan = result.data;
        const orderIds: string[] = [];

        routeplan.routes.forEach((r: any) =>
        {
            r.stops.forEach((s: any) =>
            {
                orderIds.push(...s.orderIds);
            });
        });

        routeplan.unscheduledTasks.forEach((t: any) =>
        {
            orderIds.push(t.orderId);
        });

        let orders: any[] = [];

        try
        {
            const ordersResult = await this.apiClient.post("logistics/orders/system/detailOrders",
            {
                body: {
                    internalOrderIds: orderIds
                }
            });

            orders = ordersResult.data;
        }
        catch
        {
            // If orders fails we should not break the whole routeplan
        }

        for (const route of routeplan.routes)
        {
            for (const stop of route.stops)
            {
                const stopOrders = orders.filter(o => stop.orderIds.includes(o.internalOrderId));
                stop.orderIds = stopOrders.map(o => o.orderId);
                stop.consignorIndexes = [];
            }

            route.directions =
            {
                isOptimized: false,
                positions: route.stops.map((s: any) => s.location.position)
            };
        }

        for (const unscheduledTask of routeplan.unscheduledTasks)
        {
            const order = orders.find(o => o.internalOrderId === unscheduledTask.orderId);

            if (order != null)
            {
                unscheduledTask.orderId = order.orderId;
            }

            unscheduledTask.consignorIndexes = [];
        }

        routeplan.consignors = [];

        context.response.body = routeplan;
        context.response.status = 200;
    }
}
