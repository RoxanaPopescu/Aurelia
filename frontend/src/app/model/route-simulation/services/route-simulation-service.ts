import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { IPaging, ISorting } from "shared/types";
import { RouteSimulationInfo } from "../entities/route-simulation-info";

/**
 * Represents a service that manages route simulations.
 */
@autoinject
export class RouteSimulationService
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
     * Gets all route simulations associated with the current user.
     * @param sorting The sorting options to use.
     * @param paging The paging options to use.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the route simulations.
     */
    public async getAll(sorting?: ISorting, paging?: IPaging, signal?: AbortSignal): Promise<{ simulations: RouteSimulationInfo[]; simulationCount: number }>
    {
        const result = await this._apiClient.get("routeplanning/simulations/list",
        {
            signal
        });

        return {
            simulations: result.data.map((data: any) => new RouteSimulationInfo(data)),
            simulationCount: result.data.length
        };
    }
}
