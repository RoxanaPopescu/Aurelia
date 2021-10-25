import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { DateTime } from "luxon";
import { IPaging } from "shared/types";
import { AutomaticDispatchJob, AutomaticDispatchJobStatusSlug, AutomaticDispatchRoutePlanInfo, AutomaticDispatchStartManual } from "..";

/**
 * Represents a service that manages dispatching of express routes.
 */
@autoinject
export class AutomaticDispatchService
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
     * @param paging The paging options to use.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the route plans.
     */
    public async getAll(
        filter?:
        {
            createdDateFrom?: DateTime;
            createdDateTo?: DateTime;
            statuses?: AutomaticDispatchJobStatusSlug[];
        },
        paging?: IPaging,
        signal?: AbortSignal):
        Promise<AutomaticDispatchRoutePlanInfo[]>
    {
        const result = await this._apiClient.get("automatic-dispatch/jobs",
        {
            query:
            {
                page: paging?.page,
                pageSize: paging?.pageSize,
                createdDateFrom: filter?.createdDateFrom,
                createdDateTo: filter?.createdDateTo,
                statuses: filter?.statuses
            },
            signal
        });

        return result.data.map((data: any) => new AutomaticDispatchRoutePlanInfo(data));
    }

    /**
     * Gets the specified job.
     * @param id The id identifying the automatic dispatch job.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the automatic dispatch job.
     */
    public async get(id: string, signal?: AbortSignal): Promise<AutomaticDispatchJob>
    {
        const result = await this._apiClient.get(`automatic-dispatch/jobs/${id}`,
        {
            signal
        });

        return new AutomaticDispatchJob(result.data);
    }

    /**
     * Approves a job.
     * @param id The id identifying the automatic dispatch job.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the automatic dispatch job.
     */
    public async approve(id: string, signal?: AbortSignal): Promise<void>
    {
        await this._apiClient.post(`automatic-dispatch/jobs/${id}/approve`,
        {
            signal
        });
    }

    /**
     * Starts a manual automatic dispatch based on ids.
     * @param activeRouteIds The ids identifying the routes the drivers is active on.
     * @param addRouteIds The ids identifying the routes to be added to the active driver routes.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async startManualFromExpress(activeRouteIds: string[], addRouteIds: string[], signal?: AbortSignal): Promise<string>
    {
        const result = await this._apiClient.post("automatic-dispatch/jobs/start-manual-from-express",
        {
            body: { activeRouteIds, addRouteIds },
            signal
        });

        return result.data.id;
    }

    /**
     * Starts a manual automatic dispatch based on filters.
     * @param manual The manual object with filters.
     * @returns A promise that will be resolved when the operation succeedes.
     */
     public async startManual(manual: AutomaticDispatchStartManual, signal?: AbortSignal): Promise<string>
     {
         const result = await this._apiClient.post("automatic-dispatch/jobs/start-manual",
         {
             body: manual,
             signal
         });

         return result.data.id;
     }
}
