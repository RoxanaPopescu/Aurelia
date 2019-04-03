import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { Vehicle, VehicleType } from "../../entities/vehicle";

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
        this.apiClient = apiClient;
    }

    private readonly apiClient: ApiClient;
    private vehicleTypes: VehicleType[];

    /**
     * Gets all vehicles associatd with the current user.
     * @returns A promise that will be resolved with info about the vehicles.
     */
    public async getTypes(): Promise<VehicleType[]>
    {
        if (this.vehicleTypes != null)
        {
            return this.vehicleTypes;
        }

        const result = await this.apiClient.get("vehicle-types");

        this.vehicleTypes = result.data.map((data: any) => new VehicleType(data));

        return this.vehicleTypes;
    }

    /**
     * Determines whether the specified vehicle exists.
     * @param vehicleId The ID of the vehicle whose existence should be determined.
     * @returns A promise that will be resolved with a boolean indicating whether the vehicle exists.
     */
    public async exists(vehicleId: string): Promise<boolean>
    {
        const result = await this.apiClient.head(`vehicles/${vehicleId}`,
        {
            optional: true
        });

        return result.response.ok;
    }

    /**
     * Creates a new vehicle.
     * @param vehicle The vehicle to create.
     * @param driverId The ID identifying the driver the vehicle should be associated with.
     * @returns A promise that will be resolved with the new vehicle.
     */
    public async create(vehicle: Vehicle, driverId: string): Promise<Vehicle>
    {
        const result = await this.apiClient.post("vehicles",
        {
            body: { vehicle, driverId }
        });

        return new Vehicle(result.data);
    }

    /**
     * Gets all vehicles associated with the specified driver.
     * @param driverId The ID identifying the driver whose vehicles should be returned.
     * @returns A promise that will be resolved with the vehicles.
     */
    public async getAllForDriver(driverId: string): Promise<Vehicle>
    {
        const result = await this.apiClient.get(`vehicles?driverId=${driverId}`);

        return new Vehicle(result.data);
    }

    /**
     * Gets the specified vehicle.
     * @param vehicleId The ID identifying the vehicle.
     * @returns A promise that will be resolved with the vehicle.
     */
    public async get(vehicleId: string): Promise<Vehicle>
    {
        const result = await this.apiClient.get(`vehicles/${vehicleId}`);

        return new Vehicle(result.data);
    }

    /**
     * Saves the changes made to the specified vehicle.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async save(vehicle: Vehicle, driverId: string): Promise<void>
    {
        await this.apiClient.put(`vehicles/${vehicle.id}`,
        {
            body: { vehicle, driverId }
        });
    }

    /**
     * Deletes the specified vehicle.
     * @param vehicleId The ID identifying the vehicle.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async delete(vehicleId: string): Promise<void>
    {
        await this.apiClient.delete(`vehicles/${vehicleId}`);
    }
}
