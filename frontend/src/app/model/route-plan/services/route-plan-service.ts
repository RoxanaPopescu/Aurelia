import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { IPaging, ISorting } from "shared/types";
import { LegacyRoutePlanInfo } from "../entities/legacy/legacy-route-plan-info";
import { RoutePlan } from "../entities/route-plan";
import { RoutePlanInfo } from "..";

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
     * Gets all route plans visible to the current user.
     * @param sorting The sorting options to use.
     * @param paging The paging options to use.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the route plans.
     */
    public async getAll(sorting?: ISorting, paging?: IPaging, signal?: AbortSignal): Promise<{ plans: RoutePlanInfo[]; planCount: number }>
    {
        const result = await this._apiClient.post("routeplanning/plans/list",
        {
            body:
            {
                page: 1,
                pageSize: 100,
                searchQuery: null,
                statuses: null
            },
            signal
        });

        return {
            plans: result.data.results.map((data: any) => new RoutePlanInfo(data)),
            planCount: result.data.results.length
        };
    }

    /**
     * Gets all route plans visible to the current user.
     * @param sorting The sorting options to use.
     * @param paging The paging options to use.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the route plans.
     */
    public async legacyGetAll(sorting?: ISorting, paging?: IPaging, signal?: AbortSignal): Promise<{ plans: LegacyRoutePlanInfo[]; planCount: number }>
    {
        const result = await this._apiClient.post("routeplanning/list",
        {
            body:
            {
            },
            signal
        });

        return {
            plans: result.data.results.map((data: any) => new LegacyRoutePlanInfo(data)),
            planCount: result.data.results.length
        };
    }

    /**
     * Gets the specified route plan.
     * @param routePlanSlug The slug identifying the route plan.
     * @returns A promise that will be resolved with the route plan.
     */
    public async legacyGet(routePlanSlug: string): Promise<RoutePlan>
    {
        const result = await this._apiClient.get("routeplanning/details",
        {
            query: { id: routePlanSlug }
        });

        return new RoutePlan(result.data);
    }
}
