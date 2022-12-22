import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
/**
 * Represents a service that manages routes.
 */
@autoinject
export class RouteService
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
     * Gets the specified route.
     * @param slug The slug identifying the route.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the route.
     */
    public async getRoutePath(signal?: AbortSignal): Promise<any>
    {
        const result = await this._apiClient.get("routes/path",
        {
            signal
        });
        
        return result.data;
    }
}
