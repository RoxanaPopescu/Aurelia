import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { IPaging, ISorting } from "shared/types";
import { RoutePlanSettingsInfo, RoutePlanSettings } from "app/model/entities/route-plan";

/**
 * Represents a service that manages route plan settings.
 */
@autoinject
export class RoutePlanSettingsService
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
     * Gets all route plan settings associatd with the current outfit.
     * @param sorting The sorting options to use.
     * @param paging The paging options to use.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the route plan settings.
     */
    public async getAll(sorting?: ISorting, paging?: IPaging, signal?: AbortSignal): Promise<{ settings: RoutePlanSettingsInfo[]; settingCount: number }>
    {
        const result = await this._apiClient.post("routeplanning/settings/list",
        {
            body:
            {
            },
            signal
        });

        return {
            settings: result.data.map((data: any) => new RoutePlanSettingsInfo(data)),
            settingCount: result.data.length
        };
    }

    /**
     * Gets the specified route plan settings.
     * @param id The ID of the route plan settings.
     * @returns A promise that will be resolved with the route plan settings.
     */
    public async get(id: string): Promise<RoutePlanSettings>
    {
        const result = await this._apiClient.get("routeplanning/settings/details",
        {
            query: { id }
        });

        return new RoutePlanSettings(result.data);
    }
}
