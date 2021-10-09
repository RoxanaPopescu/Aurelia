import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { RoutePlanningSettings } from "../entities/route-planning-settings";
import { RoutePlanningSettingsInfo } from "../entities/route-planning-settings-info";
import { Metadata } from "app/model/shared/entities/metadata";

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
        const response = await this._apiClient.get("route-planning/rule-sets",
        {
            signal
        });

        return response.data.results.map(d => new RoutePlanningSettingsInfo(d));
    }

    /**
     * Gets the specified route planning settings.
     * @param slug The slug identifying the route planning settings.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the route planning settings.
     */
    public async get(slug: string, signal?: AbortSignal): Promise<RoutePlanningSettings>
    {
        const result = await this._apiClient.get(`route-planning/rule-sets/${slug}`,
        {
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
        const result = await this._apiClient.post("route-planning/rule-sets",
        {
            body: settings
        });

        settings.id = result.data.id;
        settings.slug = result.data.slug;
        settings.metadata = new Metadata(result.data.metadata);
    }

    /**
     * Updates the specified route planning settings.
     * @param settings The route planning settings to save.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async update(settings: RoutePlanningSettings): Promise<void>
    {
        const result = await this._apiClient.post("route-planning/rule-sets/update",
        {
            body: settings
        });

        settings.id = result.data.id;
        settings.slug = result.data.slug;
        settings.metadata = new Metadata(result.data.metadata);
    }

    /**
     * Deletes the specified route planning settings.
     * @param id The id identifying the route planning settings to delete.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async delete(id: string): Promise<void>
    {
        await this._apiClient.post("route-planning/rule-sets/delete",
        {
            body: { id }
        });
    }
}
