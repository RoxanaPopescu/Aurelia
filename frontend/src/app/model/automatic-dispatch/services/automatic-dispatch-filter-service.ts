import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { AutomaticDispatchFilter } from "../entities/automatic-dispatch-filter";

/**
 * Represents a service that manages automatic dispatch filters.
 */
@autoinject
export class AutomaticDispatchFilterService
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
     * Gets all automatic dispatch filters.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the automatic dispatch filters.
     */
    public async getAll(signal?: AbortSignal): Promise<AutomaticDispatchFilter[]>
    {
        const result = await this._apiClient.get("automatic-dispatch/filters",
        {
            signal
        });

        return result.data.map((data: any) => new AutomaticDispatchFilter(data));
    }

    /**
     * Gets the specified automatic dispatch filter.
     * @param id The id identifying the automatic dispatch filter.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the automatic dispatch filter.
     */
    public async get(id: string, signal?: AbortSignal): Promise<AutomaticDispatchFilter>
    {
        const result = await this._apiClient.get(`automatic-dispatch/filters/${id}`,
        {
            signal
        });

        return new AutomaticDispatchFilter(result.data);
    }

    /**
     * Gets the specified automatic dispatch filter.
     * @param filter The automatic dispatch filter to create.
     * @returns A promise that will be resolved with the automatic dispatch filter.
     */
    public async create(filter: AutomaticDispatchFilter): Promise<AutomaticDispatchFilter>
    {
        const result = await this._apiClient.post(`automatic-dispatch/filters/${filter.id}`,
        {
            body: filter
        });

        return new AutomaticDispatchFilter(result.data);
    }

    /**
     * Gets the specified automatic dispatch filter.
     * @param filter The automatic dispatch filter to update.
     * @returns A promise that will be resolved with the automatic dispatch filter.
     */
    public async update(filter: AutomaticDispatchFilter): Promise<AutomaticDispatchFilter>
    {
        const result = await this._apiClient.post(`automatic-dispatch/filters/${filter.id}`,
        {
            body: filter
        });

        return new AutomaticDispatchFilter(result.data);
    }

    /**
     * Gets the specified automatic dispatch filter.
     * @param id The id identifying the automatic dispatch filter.
     * @returns A promise that will be resolved when the operation succeeds.
     */
    public async delete(id: string): Promise<void>
    {
        await this._apiClient.delete(`automatic-dispatch/filters/${id}`);
    }

    /**
     * Pauses the specified automatic dispatch filter.
     * @param id The id identifying the automatic dispatch filter.
     * @returns A promise that will be resolved with the automatic dispatch filter.
     */
    public async pause(id: string): Promise<AutomaticDispatchFilter>
    {
        const result = await this._apiClient.post(`automatic-dispatch/filters/${id}/pause`);

        return new AutomaticDispatchFilter(result.data);
    }

    /**
     * Unpauses the specified automatic dispatch filter.
     * @param id The id identifying the automatic dispatch filter.
     * @returns A promise that will be resolved with the automatic dispatch filter.
     */
     public async unpause(id: string): Promise<AutomaticDispatchFilter>
     {
         const result = await this._apiClient.post(`automatic-dispatch/filters/${id}/unpause`);

         return new AutomaticDispatchFilter(result.data);
     }
}
