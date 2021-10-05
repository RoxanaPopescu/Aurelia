import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { Driver } from "app/model/driver";
import { Fulfiller, Outfit } from "app/model/outfit";
import { Vehicle } from "app/model/vehicle";
import { RouteBase } from "../entities/route-base";
import { IdentityService } from "app/services/identity";

/**
 * Represents a service assigns routes to fulfillers or drivers.
 */
@autoinject
export class RouteAssignmentService
{
    /**
     * Creates a new instance of the type.
     * @param apiClient The `ApiClient` instance.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(apiClient: ApiClient, identityService: IdentityService)
    {
        this._apiClient = apiClient;
        this._identityService = identityService;
    }

    private readonly _apiClient: ApiClient;

    /**
     * The `IdentityService` instance.
     */
    protected readonly _identityService: IdentityService;

    /**
     * Assigns the specified route to the specified driver.
     * @param route The route to assign.
     * @param driver The driver to whom the route should be assigned.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async assignDriver(route: RouteBase, driver: Driver): Promise<void>
    {
        await this._apiClient.post("dispatch/route/assign-driver",
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
     * Assigns the specified route to the specified driver.
     * @param route The route to assign.
     * @param drivers The drivers to who we send the push request
     * @param message The custom push message to the drivers
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async pushToDrivers(route: RouteBase, drivers: Driver[], message: string | undefined): Promise<void>
    {
        await this._apiClient.post("dispatch/route/push-drivers",
        {
            body:
            {
                routeId: route.id,
                driverIds: drivers.map(d => d.id),
                message: message
            }
        });
    }

    /**
     * Assigns the specified route to the specified vehicle.
     * @param route The route to assign.
     * @param vehicle The vehicle to whom the route should be assigned.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async assignVehicle(route: RouteBase, vehicle: Vehicle): Promise<void>
    {
        await this._apiClient.post("dispatch/route/assign-vehicle",
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
     * Assigns the specified route to the specified executor.
     * @param route The route to assign.
     * @param executor The executor to which the route should be assigned.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async assignExecutor(route: RouteBase, executor: Fulfiller, currentOutfit?: Outfit): Promise<void>
    {
        await this._apiClient.post("dispatch/route/assign-executor",
        {
            body:
            {
                routeId: route.id,
                newFulfillerId: executor.id,
                currentFulfillerId: currentOutfit?.id ?? this._identityService.identity!.outfit!.id
            }
        });

        route.fulfiller = executor;
    }
}
