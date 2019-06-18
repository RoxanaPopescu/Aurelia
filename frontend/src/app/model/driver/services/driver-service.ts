import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { IPaging, ISorting } from "shared/types";
import { VehicleService } from "app/model/vehicle";
import { Driver } from "../entities/driver";

/**
 * Represents a service that manages drivers.
 */
@autoinject
export class DriverService
{
    /**
     * Creates a new instance of the type.
     * @param apiClient The `ApiClient` instance.
     * @param vehicleService The `VehicleService` instance.
     */
    public constructor(apiClient: ApiClient, vehicleService: VehicleService)
    {
        this._apiClient = apiClient;
        this._vehicleService = vehicleService;
    }

    private readonly _apiClient: ApiClient;
    private readonly _vehicleService: VehicleService;

    /**
     * Gets all drivers associated with the current user.
     * @param sorting The sorting options to use.
     * @param paging The paging options to use.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the drivers.
     */
    public async getAll(sorting?: ISorting, paging?: IPaging, signal?: AbortSignal): Promise<{ drivers: Driver[]; driverCount: number }>
    {
        const result = await this._apiClient.get("drivers/list",
        {
            signal
        });

        const vehicleTypes = await this._vehicleService.getTypes();

        return {
            drivers: result.data.map((data: any) =>
            {
                const driverVehicleTypes = data.vehicleTypeIds.map(id => vehicleTypes.find(vt => vt.id === id));

                return new Driver(data.driver, driverVehicleTypes);
            }),
            driverCount: result.data.length
        };
    }
}
