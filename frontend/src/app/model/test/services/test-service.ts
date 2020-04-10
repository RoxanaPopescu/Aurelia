import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";

/**
 * Represents a service that manages vehicles.
 */
@autoinject
export class TestService
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
     * Creates a new vehicle, associated with the specified driver.
     * @param vehicle The vehicle to create.
     * @param driverId The ID of the driver the vehicle should be associated with. If none is supplied the current user will create it.
     * @returns A promise that will be resolved with the new vehicle.
     */
    public async copyRequest(
        id: string,
        driverId: string | undefined = undefined
    ): Promise<{ slug: string }>
    {
        const result = await this._apiClient.post("test/copyRequest",
        {
            body: { requestId: id, driverId }
        });

        return result.data;
    }
}
