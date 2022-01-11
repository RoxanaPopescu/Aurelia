import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { AutomaticDispatchSettings } from "../entities/automatic-dispatch-settings";

/**
 * Represents a service that manages automatic dispatch settings.
 */
@autoinject
export class AutomaticDispatchSettingsService
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
     * Gets all automatic dispatch settings.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the automatic dispatch settings.
     */
    public async getAll(signal?: AbortSignal): Promise<AutomaticDispatchSettings[]>
    {
        const result = await this._apiClient.get("automatic-dispatch/settings",
        {
            signal
        });

        return result.data.map((data: any) => new AutomaticDispatchSettings(data));
    }

    /**
     * Gets the specified automatic dispatch filter.
     * @param id The id identifying the automatic dispatch filter.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the automatic dispatch filter.
     */
    public async get(id: string, signal?: AbortSignal): Promise<AutomaticDispatchSettings>
    {
        const result = await this._apiClient.get(`automatic-dispatch/settings/${id}`,
        {
            signal
        });

        return new AutomaticDispatchSettings(result.data);
    }

    /**
     * Gets the specified automatic dispatch filter.
     * @param filter The automatic dispatch filter to create.
     * @returns A promise that will be resolved with the automatic dispatch filter.
     */
    public async create(filter: AutomaticDispatchSettings): Promise<AutomaticDispatchSettings>
    {
        const result = await this._apiClient.post(`automatic-dispatch/settings/${filter.id}`,
        {
            body: filter
        });

        return new AutomaticDispatchSettings(result.data);
    }

    /**
     * Gets the specified automatic dispatch filter.
     * @param filter The automatic dispatch filter to update.
     * @returns A promise that will be resolved with the automatic dispatch filter.
     */
    public async update(filter: AutomaticDispatchSettings): Promise<AutomaticDispatchSettings>
    {
        const result = await this._apiClient.post(`automatic-dispatch/settings/${filter.id}`,
        {
            body: filter
        });

        return new AutomaticDispatchSettings(result.data);
    }

    /**
     * Gets the specified automatic dispatch filter.
     * @param id The id identifying the automatic dispatch filter.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    public async delete(id: string): Promise<void>
    {
        await this._apiClient.delete(`automatic-dispatch/settings/${id}`);
    }

    /**
     * Pauses the specified automatic dispatch filter.
     * @param id The id identifying the automatic dispatch filter.
     * @returns A promise that will be resolved with the automatic dispatch filter.
     */
    public async pause(id: string): Promise<AutomaticDispatchSettings>
    {
        const result = await this._apiClient.post(`automatic-dispatch/settings/${id}/pause`);

        return new AutomaticDispatchSettings(result.data);
    }

    /**
     * Unpauses the specified automatic dispatch filter.
     * @param id The id identifying the automatic dispatch filter.
     * @returns A promise that will be resolved with the automatic dispatch filter.
     */
     public async unpause(id: string): Promise<AutomaticDispatchSettings>
     {
         const result = await this._apiClient.post(`automatic-dispatch/settings/${id}/unpause`);

         return new AutomaticDispatchSettings(result.data);
     }
}