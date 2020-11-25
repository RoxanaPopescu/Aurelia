import { autoinject } from "aurelia-framework";
import { DateTime } from "luxon";
import { ApiClient } from "shared/infrastructure";
import { IPaging, ISorting } from "shared/types";
import { LegacyRoutePlanInfo } from "../entities/legacy/legacy-route-plan-info";
import { RoutePlanInfo } from "../entities/route-plan-info";
import { RoutePlanStatusSlug } from "../entities/route-plan-status";

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
    public async getAll(
        filter?:
        {
            createdDateFrom?: DateTime;
            createdDateTo?: DateTime;
            searchQuery?: string;
            statuses?: RoutePlanStatusSlug[];
        },
        sorting?: ISorting,
        paging?: IPaging,
        signal?: AbortSignal):
        Promise<{ plans: RoutePlanInfo[] }>
    {
        const result = await this._apiClient.post("routeplanning/plans/list",
        {
            body:
            {
                page: paging?.page,
                pageSize: paging?.pageSize,
                createdDateFrom: filter?.createdDateFrom,
                createdDateTo: filter?.createdDateTo,
                searchQuery: filter?.searchQuery,
                statuses: filter?.statuses
            },
            signal
        });

        return {
            plans: result.data.results.map((data: any) => new RoutePlanInfo(data))
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
}
