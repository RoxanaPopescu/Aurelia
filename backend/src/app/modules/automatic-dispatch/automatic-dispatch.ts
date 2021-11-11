import { DateTime } from "luxon";
import { AppContext } from "../../app-context";
import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to tracking.
 */
export class AutomaticDispatchModule extends AppModule
{
    /**
     * Gets the jobs for automatic dispatch
     * @returns The a list of jobs.
     */
    public "GET /v2/automatic-dispatch/jobs" = async (context: AppContext) =>
    {
        await context.authorize("view-routes");

        const result = await this.apiClient.get("automatic-dispatch/jobs",
        {
            headers: { "ownerId": context.user?.organizationId },
            query: context.query
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Gets the automatic dispatch job by ID.
     * @param context.params.id The ID of the automatic dispatch job to receive.
     * @returns The automatic dispatch job of the specified ID.
     */
    public "GET /v2/automatic-dispatch/jobs/:id" = async (context: AppContext) =>
    {
        await context.authorize("view-routes");

        const result = await this.apiClient.get(`automatic-dispatch/jobs/${context.params.id}`,
        {
            headers: { "ownerId": context.user?.organizationId }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Gets the automatic dispatch job by ID.
     * @param context.params.id The ID of the automatic dispatch job to receive.
     * @returns The automatic dispatch job of the specified ID.
     */
    public "POST /v2/automatic-dispatch/jobs/:id/approve" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        const result = await this.apiClient.post(`automatic-dispatch/jobs/${context.params.id}/approve`,
        {
            headers: {
                "ownerId": context.user?.organizationId
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Updates the configuration for automatic dispatch
     * @returns 200 OK if succeded.
     */
    public "POST /v2/automatic-dispatch/configuration" = async (context: AppContext) =>
    {
        await context.authorize("view-routes");

        const result = await this.apiClient.post(`externalcourier/courier/configurations/${context.user?.organizationId}/toggle-receive-orders`,
        {
            headers: {
                "ownerId": context.user?.organizationId,
                "magictoken": "6b42afbd-5bdc-4cde-b9e7-7929c0209dd7"
            },
            body: context.request.body
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Gets the configuration for automatic dispatch
     * @returns The specific configuration.
     */
    public "GET /v2/automatic-dispatch/configuration" = async (context: AppContext) =>
    {
        await context.authorize("view-routes");

        const result = await this.apiClient.get(`externalcourier/courier/configurations/${context.user?.organizationId}`,
        {
            headers: {
                "ownerId": context.user?.organizationId,
                "magictoken": "6b42afbd-5bdc-4cde-b9e7-7929c0209dd7"
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Starts a manual automatic dispatch dependent on filters
     * @returns 200 OK if succeded.
     */
    public "POST /v2/automatic-dispatch/jobs/start-manual" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        const result = await this.apiClient.post("automatic-dispatch-orchestrator/jobs",
        {
            body: context.request.body,
            headers: { "ownerId": context.user?.organizationId }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Starts a manual automatic dispatch from express dispatch
     * @returns 200 when the event is received
     */
    public "POST /v2/automatic-dispatch/jobs/start-manual-from-express" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        const activeRouteIds: string[] = context.request.body.activeRouteIds;
        const addRouteIds: string[] = context.request.body.addRouteIds;

        // 1. Fetch the routes dependent on the routeIds
        const routeResult = await this.apiClient.post("logistics-platform/routes/v4/list",
        {
            noi: true,
            body: {
                fulfillerIds: [context.user?.organizationId],
                routeIds: [...activeRouteIds, ...addRouteIds],
                include: { vehicle: true, stops: true, driver: true, driverPosition: true },
                statuses: [1, 2, 3, 6],
                pageSize: 500
            }
        });

        // 2. We filter out any not needed stops (status has to be not-visited and type pickup | delivery)
        const activeRoutes = routeResult.data.routes.filter((r: any) => activeRouteIds.includes(r.id));
        const addRoutes = routeResult.data.routes.filter((r: any) => addRouteIds.includes(r.id));
        const activeStopIds = [];

        for (const route of activeRoutes)
        {
            route.timeZone = route.stops[0].location.timeZone;

            const filteredStops: any[] = route.stops.filter((s: any) => s.status === "NotVisited" && ["Pickup", "Delivery"].includes(s.type));
            activeStopIds.push(...filteredStops.map((s: any) => s.id));
            route.stops = filteredStops;
        }

        // 3. Fetch the original stop & request links
        const linkResult = await this.apiClient.post("logistics-platform/express-dispatch/original-linked-stops",
        {
            noi: true,
            body: {
                accessOutfits: [context.user?.organizationId],
                stopIds: activeStopIds
            }
        });

        const linkDictionary: { [name: string]: { originalStopId: string; originalRequestId: string }} = linkResult.data;

        // 4. Restructure the model
        const request: any = {};
        const routes: any[] = [];
        const shipments: any[] = [];

        // 4.1 Structure shipments - one for each delivery on each route
        for (const route of addRoutes)
        {
            let pickupStop: any | undefined;

            for (const stop of route.stops)
            {
                // We do not support if some delivery stops are linked to pickup stops earlier in the route
                if (stop.type === "Pickup")
                {
                    pickupStop = stop;
                }

                if (stop.type !== "Delivery" || pickupStop == null)
                {
                    continue;
                }

                shipments.push({
                    id: route.id,
                    pickup: {
                        id: pickupStop.id,
                        arrivalTimeFrame: pickupStop.arrivalTimeFrame,
                        location: pickupStop.location
                    },
                    delivery: {
                        id: stop.id,
                        arrivalTimeFrame: stop.arrivalTimeFrame,
                        location: stop.location
                    }
                });
            }
        }

        // 4.2 Structure routes - one for each route
        for (const route of activeRoutes)
        {
            const stops: any[] = [];

            for (const stop of route.stops)
            {
                // First check if stop exists in link table
                const link = linkDictionary[stop.id];

                if (link == null)
                {
                    continue;
                }

                stops.push({
                    id: stop.id,
                    type: stop.type.toLowerCase(),
                    estimates: stop.estimates,
                    location: stop.location,
                    arrivalTimeFrame: stop.arrivalTimeFrame,
                    taskTime: stop.initialEstimates?.taskTime,
                    groupId: link.originalRequestId
                });
            }

            const availability = route.plannedTimeFrame;
            const now = DateTime.utc();
            const local = now.setZone(route.timeZone);
            availability.from = local.toString();

            routes.push({
                driverId: `${route.driver.id}`,
                id: route.id,
                vehicleType: route.vehicleType,
                availability: availability,
                driverPosition: route.driverPosition,
                stops: stops
            });
        }

        request.name = `${context.user?.fullName} - routes ${routes.length} - shipments ${shipments.length}`;
        request.routes = routes;
        request.shipments = shipments;

        // 5. Send to backend service
        const result = await this.apiClient.post("automatic-dispatch/jobs",
        {
            body: request,
            headers: { "ownerId": context.user?.organizationId }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }
}
