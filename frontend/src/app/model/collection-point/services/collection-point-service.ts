import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { CollectionPoint } from "..";

/**
 * Represents a service that manages collection points.
 */
@autoinject
export class CollectionPointService
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
     * Gets the specified collection point.
     * @param id The id identifying the collection point.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the collection point.
     */
    public async get(id: string, signal?: AbortSignal): Promise<CollectionPoint>
    {
        const result = await this._apiClient.get(`collection-point/details/${id}`,
        {
            signal
        });

        return new CollectionPoint(result.data);
    }
}
