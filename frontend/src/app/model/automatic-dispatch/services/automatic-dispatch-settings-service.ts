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
     * Gets the specified automatic dispatch settings.
     * @param id The id identifying the automatic dispatch settings.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the automatic dispatch settings.
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
     * Creates the specified automatic dispatch settings.
     * @param settings The automatic dispatch settings to create.
     * @returns A promise that will be resolved with the automatic dispatch settings.
     */
    public async create(settings: AutomaticDispatchSettings): Promise<AutomaticDispatchSettings>
    {
        const result = await this._apiClient.post("automatic-dispatch/settings/create",
        {
            body: settings
        });

        return new AutomaticDispatchSettings(result.data);
    }

    /**
     * Updates the specified automatic dispatch settings.
     * @param settings The automatic dispatch settings to update.
     * @returns A promise that will be resolved with the automatic dispatch settings.
     */
    public async update(settings: AutomaticDispatchSettings): Promise<AutomaticDispatchSettings>
    {
        const result = await this._apiClient.post(`automatic-dispatch/settings/${settings.id}/update`,
        {
            body: settings
        });

        return new AutomaticDispatchSettings(result.data);
    }

    /**
     * Deletes the specified automatic dispatch settings.
     * @param id The id identifying the automatic dispatch settings.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    public async delete(id: string): Promise<void>
    {
        await this._apiClient.post(`automatic-dispatch/settings/${id}/delete`);
    }

    /**
     * Pauses the specified automatic dispatch settings.
     * @param id The id identifying the automatic dispatch settings.
     * @returns A promise that will be resolved with the automatic dispatch settings.
     */
    public async pause(id: string): Promise<AutomaticDispatchSettings>
    {
        const result = await this._apiClient.post(`automatic-dispatch/settings/${id}/pause`);

        return new AutomaticDispatchSettings(result.data);
    }

    /**
     * Unpauses the specified automatic dispatch settings.
     * @param id The id identifying the automatic dispatch settings.
     * @returns A promise that will be resolved with the automatic dispatch settings.
     */
    public async unpause(id: string): Promise<AutomaticDispatchSettings>
    {
        const result = await this._apiClient.post(`automatic-dispatch/settings/${id}/unpause`);

        return new AutomaticDispatchSettings(result.data);
    }

    /**
     * Starts a new dispatch job immediately, using the specified automatic dispatch settings.
     * @param id The id identifying the automatic dispatch settings.
     * @returns A promise that will be resolved with the ID of the new dispatch job.
     */
    public async runNow(id: string): Promise<string>
    {
        var result = await this._apiClient.post(`automatic-dispatch/settings/${id}/run-now`);

        return result.data.id;
    }
}
