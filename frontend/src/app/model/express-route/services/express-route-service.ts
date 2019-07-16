import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { ExpressRoute } from "../entities/express-route";
import { DriverRoute } from "../entities/driver-route";

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
    public async getExpressRoutes(signal?: AbortSignal): Promise<{ routes: ExpressRoute[]; routeCount: number }>
    {
        const result = await this._apiClient.post("express-routes/get-express-routes",
        {
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
    public async getDriverRoutes(signal?: AbortSignal): Promise<{ routes: DriverRoute[]; routeCount: number }>
    {
        const result = await this._apiClient.post("express-routes/get-driver-routes",
        {
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
    public async estimateDriverRoute(driverId: string, stopIds: string[], signal?: AbortSignal): Promise<DriverRoute>
    {
        const result = await this._apiClient.post("express-routes/estimate-driver-route",
        {
            body: { driverId, stopIds },
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
    public async updateDriverRoute(driverId: string, stopIds: string[], signal?: AbortSignal): Promise<DriverRoute>
    {
        const result = await this._apiClient.post("express-routes/update-driver-route",
        {
            body: { driverId, stopIds },
            signal
        });

        return new DriverRoute(result.data);
    }
}
