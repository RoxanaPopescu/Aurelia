import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { IPaging, ISorting } from "shared/types";
import { VehicleService } from "app/model/vehicle";
import { Driver } from "../entities/driver";
import { DriverStatusSlug } from "../entities/driver-status";

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
     * Gets all drivers visible to the current user.
     * @param sorting The sorting options to use.
     * @param paging The paging options to use.
     * @param filters The filter options to use.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the drivers.
     */
    public async getAll(
        sorting?: ISorting,
        paging?: IPaging,
        filter?: { statuses?: DriverStatusSlug[]; searchQuery?: string },
        signal?: AbortSignal
    ): Promise<{ results: Driver[]; driverCount?: number }>
    {
        const result = await this._apiClient.post("drivers/list",
        {
            signal,
            body:
            {
                sorting: sorting,
                paging: paging,
                filter:
                {
                    searchQuery: filter?.searchQuery,
                    statuses: filter?.statuses
                }
            }
        });

        const vehicleTypes = await this._vehicleService.getTypes();

        return {
            results: result.data.results.map((data: any) =>
            {
                const driverVehicleTypes = data.vehicleTypeIds.map(id => vehicleTypes.find(vt => vt.id === id));

                return new Driver(data.driver, driverVehicleTypes);
            })
        };
    }

    /**
     * Saves the specified driver.
     * @param driver The vehicle to save.
     * @returns A promise that will be resolved with the updated driver.
     */
    public async sendMessage(driver: Driver, type: "sms" | "push", message: string, title?: string): Promise<void>
    {
        await this._apiClient.post("drivers/send-message",
        {
            body: {
                driverId: driver.id,
                type: type,
                message: message,
                title: title
            }
        });
    }

    /**
     * Saves the specified driver.
     * @param driver The vehicle to save.
     * @returns A promise that will be resolved with the updated driver.
     */
    public async update(driver: Driver): Promise<Driver>
    {
        const result = await this._apiClient.post("drivers/update",
        {
            body: driver
        });

        return new Driver(result.data);
    }

    /**
     * Creates a new driver, associated with the specified driver.
     * @param driver The driver to create.
     * @returns A promise that will be resolved with the new driver.
     */
    public async create(driver: Driver): Promise<Driver>
    {
        const result = await this._apiClient.post("drivers/create",
        {
            body: driver
        });

        return new Driver(result.data);
    }

    /**
     * Creates a new driver, associated with the specified driver.
     * @param driverId The driver id.
     * @param newPassword The new password for the driver .
     * @returns A promise that will be resolved.
     */
    public async updatePassword(driverId: string, newPassword: string): Promise<void>
    {
        await this._apiClient.post("drivers/setpassword",
        {
            body: { id: driverId, newPassword }
        });
    }

    /**
     * Gets a single driver
     * @param driverId The id of the driver.
     * @returns A promise that will be resolved with the drivers.
     */
    public async get(driverId: string): Promise<Driver>
    {
        const result = await this._apiClient.get("drivers/details",
        {
            query: { id: driverId }
        });

        return new Driver(result.data);
    }

    /**
     * Deletes the specified vehicle.
     * @param driverId The ID of the driver to be deleted.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async delete(id: string): Promise<void>
    {
        await this._apiClient.post("drivers/delete",
        {
            body: { id }
        });
    }
}
