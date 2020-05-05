import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { Route } from "../entities/route";
import { Driver } from "app/model/driver";
import { Fulfiller } from "app/model/outfit";
import { Vehicle } from "app/model/vehicle";

/**
 * Represents a service assigns routes to fulfillers or drivers.
 */
@autoinject
export class RouteAssignmentService
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
     * Assigns the specified route to the specified driver.
     * @param route The route to assign.
     * @param driver The driver to whom the route should be assigned.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async assignDriver(route: Route, driver: Driver): Promise<void>
    {
        await this._apiClient.post("dispatch/route/assigndriver",
        {
            body:
            {
                routeId: route.id,
                driverId: driver.id
            }
        });

        route.driver = driver;
    }

    /**
     * Assigns the specified route to the specified vehicle.
     * @param route The route to assign.
     * @param vehicle The vehicle to whom the route should be assigned.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async assignVehicle(route: Route, vehicle: Vehicle): Promise<void>
    {
        await this._apiClient.post("dispatch/route/assignvehicle",
        {
            body:
            {
                routeId: route.id,
                vehicleId: vehicle.id
            }
        });

        route.vehicle = vehicle;
    }

    /**
     * Assigns the specified route to the specified fulfiller.
     * @param route The route to assign.
     * @param fulfiller The fulfiller to which the route should be assigned.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async assignFulfiller(route: Route, fulfiller: Fulfiller): Promise<void>
    {
        await this._apiClient.post("dispatch/route/assignfulfiller",
        {
            body:
            {
                routeId: route.id,
                fulfillerId: fulfiller.id,
                currentFulfillerId: route.fulfiller.id
            }
        });

        route.fulfiller = fulfiller;
    }
}
