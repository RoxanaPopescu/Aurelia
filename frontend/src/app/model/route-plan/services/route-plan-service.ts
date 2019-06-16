import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { IPaging, ISorting } from "shared/types";
import { RoutePlanInfo } from "../entities/route-plan-info";
import { RoutePlan } from "../entities/route-plan";

/**
 * Represents a service that manages route plans.
 */
@autoinject
export class RoutePlanService
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
     * Gets all route plans associatd with the current outfit.
     * @param sorting The sorting options to use.
     * @param paging The paging options to use.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the route plans.
     */
    public async getAll(sorting?: ISorting, paging?: IPaging, signal?: AbortSignal): Promise<{ plans: RoutePlanInfo[]; planCount: number }>
    {
        const result = await this._apiClient.post("routeplanning/list",
        {
            body:
            {
            },
            signal
        });

        return {
            plans: result.data.results.map((data: any) => new RoutePlanInfo(data)),
            planCount: result.data.results.length
        };
    }

    /**
     * Gets the specified route plan.
     * @param routePlanSlug The slug identifying the route plan.
     * @returns A promise that will be resolved with the route plan.
     */
    public async get(routePlanSlug: string): Promise<RoutePlan>
    {
        const result = await this._apiClient.get("routeplanning/details",
        {
            query: { id: routePlanSlug }
        });

        return new RoutePlan(result.data);
    }
}
