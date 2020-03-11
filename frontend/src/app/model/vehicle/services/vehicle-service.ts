import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { Vehicle, VehicleType } from "app/model/vehicle";
import { Session } from "shared/src/model/session";
import { VehicleStatusSlug } from "../entities/vehicle-status";

/**
 * Represents a service that manages vehicles.
 */
@autoinject
export class VehicleService
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
     * Gets the supported vehicle types.
     * @returns A promise that will be resolved with the supported vehicle types.
     */
    public async getTypes(): Promise<VehicleType[]>
    {
        return Session.vehicleTypes.map(vt => new VehicleType(vt));
    }

    /**
     * Savesthe specified vehicle.
     * @param vehicle The vehicle to save.
     * @returns A promise that will be resolved with the updated vehicle.
     */
    public async update(vehicle: Vehicle): Promise<Vehicle>
    {
        const result = await this._apiClient.post("vehicles/update",
        {
            body: { vehicle }
        });

        return new Vehicle(result.data);
    }

    /**
     * Creates a new vehicle, associated with the specified driver.
     * @param vehicle The vehicle to create.
     * @param driverId The ID of the driver the vehicle should be associated with. If none is supplied the current user will create it.
     * @returns A promise that will be resolved with the new vehicle.
     */
    public async create(vehicle: Vehicle, driverId: string | undefined = undefined): Promise<Vehicle>
    {
        const result = await this._apiClient.post("vehicles/create",
        {
            body: { vehicle, driverId }
        });

        return new Vehicle(result.data);
    }

    /**
     * Gets all vehicles associated with the specified driver.
     * @param driverId The ID of the driver whose vehicles should be returned.
     * @returns A promise that will be resolved with the vehicles.
     */
    public async getAllFromDriver(driverId: string): Promise<Vehicle>
    {
        const result = await this._apiClient.get("drivers/vehicles",
        {
            query: { id: driverId }
        });

        return new Vehicle(result.data);
    }

    /**
     * Gets all vehicles associated with the specified fulfiller.
     * @returns A promise that will be resolved with the vehicles.
     */
    public async getAll(filter?: { status?: VehicleStatusSlug, minimumVehicleType?: VehicleType }, signal?: AbortSignal): Promise<Vehicle[]>
    {
        const result = await this._apiClient.post("vehicles/list",
        {
            body:
            {
                filter: filter ? {
                    status: filter?.status,
                    minimumVehicleType: filter?.minimumVehicleType?.id
                } : undefined
            },
            signal
        });

        return result.data.results.map(vehicle => new Vehicle(vehicle));
    }

    /**
     * Deletes the specified vehicle.
     * @param driverId The ID of the driver whose vehicle should be deleted.
     * @param vehicleId The ID of the vehicle.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async delete( id: string ): Promise<void>
    {
        await this._apiClient.post("vehicles/delete",
        {
            body: { id }
        });
    }
}
