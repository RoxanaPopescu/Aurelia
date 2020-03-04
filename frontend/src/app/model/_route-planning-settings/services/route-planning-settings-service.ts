import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { RoutePlanningSettings } from "../entities/route-planning-settings";
import { RoutePlanningSettingsInfo } from "../entities/route-planning-settings-info";

/**
 * Represents a service that manages route planning settings.
 */
@autoinject
export class RoutePlanningSettingsService
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
     * Gets all route planning settings.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the route planning settings.
     */
    public async getAll(signal?: AbortSignal): Promise<RoutePlanningSettingsInfo[]>
    {
        const result = await this._apiClient.get("routeplanning/settings2/list",
        {
            signal
        });

        return result.data.map(d => new RoutePlanningSettingsInfo(d));
    }

    /**
     * Gets the specified route planning settings.
     * @param slug The slug identifying the route planning settings.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the route planning settings.
     */
    public async get(slug: string, signal?: AbortSignal): Promise<RoutePlanningSettings>
    {
        const result = await this._apiClient.get("routeplanning/settings2/details",
        {
            query: { slug },
            signal
        });

        return new RoutePlanningSettings(result.data);
    }

    /**
     * Creates the specified route planning settings.
     * @param settings The route planning settings to create.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async create(settings: RoutePlanningSettings): Promise<void>
    {
        await this._apiClient.post("routeplanning/settings2/create",
        {
            body: settings
        });
    }

    /**
     * Updates the specified route planning settings.
     * @param settings The route planning settings to save.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async update(settings: RoutePlanningSettings): Promise<void>
    {
        await this._apiClient.post("routeplanning/settings2/update",
        {
            body: settings
        });
    }

    /**
     * Deletes the specified route planning settings.
     * @param slug The slug identifying the route planning settings to delete.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async delete(slug: string): Promise<void>
    {
        await this._apiClient.post("routeplanning/settings2/delete",
        {
            body: { slug }
        });
    }
}
