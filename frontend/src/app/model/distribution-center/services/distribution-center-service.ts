import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { IPaging, ISorting } from "shared/types";
import { DistributionCenter } from "../entities/distribution-center";

/**
 * Represents a service that manages depots.
 */
@autoinject
export class DistributionCenterService
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
     * Gets all depots visible to the current user.
     * @param sorting The sorting options to use.
     * @param paging The paging options to use.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the depots.
     */
    public async getAll(sorting?: ISorting, paging?: IPaging, signal?: AbortSignal): Promise<DistributionCenter[]>
    {
        const result = await this._apiClient.get("distribution-centers",
        {
            signal
        });

        return result.data.map((data: any) => new DistributionCenter(data));
    }
}
