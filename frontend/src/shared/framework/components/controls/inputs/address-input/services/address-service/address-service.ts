import { Location, Address } from "app/model/shared";
import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";

/**
 * Represents a service for getting address info.
 */
@autoinject
export class AddressService
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
     * Gets the addresses matching the specified query.
     * @param query The address string for which addresses should be returned.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the addresses.
     */
    public async getAddresses(query: string, signal?: AbortSignal): Promise<Address[]>
    {
        if (!query)
        {
            return [];
        }

        const result = await this._apiClient.post("locations/addressautocomplete",
        {
            body: { query },
            signal
        });

        return result.data.results.map(data => new Address(data));
    }

    /**
     * Gets the location for the specified address.
     * @param address The address for which the location should be returned.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the location.
     */
    public async getLocation(address: Address, signal?: AbortSignal): Promise<Location>
    {
        const result = await this._apiClient.post("locations/address",
        {
            body: { id: address.id, provider: address.provider },
            signal
        });

        return new Location(result.data);
    }
}
