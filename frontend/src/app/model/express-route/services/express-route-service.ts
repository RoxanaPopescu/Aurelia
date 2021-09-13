import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { ExpressRoute } from "../entities/express-route";
import { DriverRoute } from "../entities/driver-route";
import { DateTime } from "luxon";

/**
 * Represents a service that manages dispatching of express routes.
 */
@autoinject
export class ExpressRouteService
{
    /**
     * Creates a new instance of the type.
     * @param apiClient The `ApiClient` instance.
     */
    public constructor(apiClient: ApiClient)
    {
        this._apiClient = apiClient;
    }

    private readonly _apiClient: ApiClient;

    /**
     * Gets all express routes visible to the current user.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the routes.
     */
    public async getExpressRoutes(date: DateTime, signal?: AbortSignal): Promise<{ routes: ExpressRoute[]; routeCount: number }>
    {
        const result = await this._apiClient.get("expressdispatch/newroutes",
        {
            query: { date },
            signal
        });

        return {
            routes: result.data.map((data: any) => new ExpressRoute(data)),
            routeCount: result.data.length
        };
    }

    /**
     * Gets all driver routes visible to the current user.
     * Note that this only includes drivers who are on contract.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the routes.
     */
    public async getDriverRoutes(date: DateTime, signal?: AbortSignal): Promise<{ routes: DriverRoute[]; routeCount: number }>
    {
        const result = await this._apiClient.get("expressdispatch/driverroutes",
        {
            query: { date },
            signal
        });

        return {
            routes: result.data.map((data: any) => new DriverRoute(data)),
            routeCount: result.data.length
        };
    }

    /**
     * Gets an estimated route for the specified driver, including the specified stops.
     * @param driverId The ID of the driver for which the route should be estimated.
     * @param stopIds The IDs of the stops to include in the estimated route, in the order they should be visited.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the estimated route.
     */
    public async estimateDriverRoute(routeId: string, stopIds: string[], addRouteIds: string[], signal?: AbortSignal): Promise<DriverRoute>
    {
        const result = await this._apiClient.post("expressdispatch/estimatedriverroute",
        {
            body: { routeId, stopIds, addRouteIds },
            signal
        });

        return new DriverRoute(result.data);
    }

    /**
     * Updates the route for the specified driver to include the specified stops.
     * @param driverId The ID of the driver for which the route should be estimated.
     * @param stopIds The IDs of the stops to include in the estimated route, in the order they should be visited.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the estimated route.
     */
    public async updateDriverRoute(routeId: string, stopIds: string[], addRouteIds: string[], signal?: AbortSignal): Promise<void>
    {
        await this._apiClient.post("expressdispatch/updatedriverroute",
        {
            body: { routeId, stopIds, addRouteIds },
            signal
        });
    }

    /**
     * Releases the specified express routes, making them available to drivers who are not on contract.
     * @param routeIds The IDs of the routes to release.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async releaseExpressRoutes(routeIds: string[], signal?: AbortSignal): Promise<void>
    {
        await this._apiClient.post("expressdispatch/releaseroute",
        {
            body: { routeIds },
            signal
        });
    }

    /**
     * Starts a manual automatic dispatch.
     * @param activeRouteIds The ids identifying the routes the drivers is active on.
     * @param addRouteIds The ids identifying the routes to be added to the active driver routes.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async startManual(activeRouteIds: string[], addRouteIds: string[], signal?: AbortSignal): Promise<void>
    {
        await this._apiClient.post(`automatic-dispatch/jobs/start-manual`,
        {
            body: { activeRouteIds, addRouteIds },
            signal
        });
    }
}
