import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { IPaging, ISorting } from "shared/types";
import { RouteSettingsInfo } from "../entities/route-settings-info";

/**
 * Represents a service that manages route plan settings.
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
     * Gets all route plan settings associated with the current outfit.
     * @param sorting The sorting options to use.
     * @param paging The paging options to use.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the route plan settings.
     */
    public async getAll(sorting?: ISorting, paging?: IPaging, signal?: AbortSignal): Promise<{ settings: RouteSettingsInfo[]; settingCount: number }>
    {
        const result = await this._apiClient.post("routeplanning/settings/list",
        {
            body:
            {
            },
            signal
        });

        return {
            settings: result.data.map((data: any) => new RouteSettingsInfo(data)),
            settingCount: result.data.length
        };
    }
}
