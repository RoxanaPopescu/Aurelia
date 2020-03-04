import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { RouteOptimizationSettings } from "../entities/route-optimization-settings";
import { RouteOptimizationSettingsInfo } from "../entities/route-optimization-settings-info";

/**
 * Represents a service that manages route optimization settings.
 */
@autoinject
export class RouteSettingsService
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
     * Gets all route optimization settings.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the route optimization settings.
     */
    public async getAll(signal?: AbortSignal): Promise<RouteOptimizationSettingsInfo[]>
    {
        const result = await this._apiClient.get("routeoptimization/settings/list",
        {
            signal
        });

        return result.data.map(d => new RouteOptimizationSettingsInfo(d));
    }

    /**
     * Gets the specified route optimization settings.
     * @param slug The slug identifying the route optimization settings.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the route optimization settings.
     */
    public async get(slug: string, signal?: AbortSignal): Promise<RouteOptimizationSettings>
    {
        const result = await this._apiClient.get("routeoptimization/settings/details",
        {
            query: { slug },
            signal
        });

        return new RouteOptimizationSettings(result.data);
    }

    /**
     * Saves the specified route optimization settings.
     * @param settings The route optimization settings to save.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async save(settings: RouteOptimizationSettings): Promise<void>
    {
        await this._apiClient.post("routeoptimization/settings/update",
        {
            body: settings
        });
    }

    /**
     * Deletes the specified route optimization settings.
     * @param slug The slug identifying the route optimization settings to delete.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async delete(slug: string): Promise<void>
    {
        await this._apiClient.post("routeoptimization/settings/delete",
        {
            body: { slug }
        });
    }
}
