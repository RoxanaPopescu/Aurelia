import { autoinject } from "aurelia-framework";
import { DateTime } from "luxon";
import { ApiClient } from "shared/infrastructure";
import { DistributionCenter } from "../entities/distribution-center";
import { DistributionCenterRoute } from "../entities/distribution-center-route";
import { DistributionCenterRouteRemark } from "../entities/distribution-center-route-remark";

/**
 * Represents a service that manages distribution centers.
 */
@autoinject
export class DistributionCenterService
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
     * Gets all distribution centers visible to the current user.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the distribution centers.
     */
    public async getAll(signal?: AbortSignal): Promise<DistributionCenter[]>
    {
        const result = await this._apiClient.get("distribution-centers",
            {
                signal
            });

        return result.data.map((data: any) => new DistributionCenter(data));
    }

    /**
     * Gets the specified distribution center.
     * @param id The ID of the distribution center.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the specified distribution center.
     */
    public async get(id: string, signal?: AbortSignal): Promise<DistributionCenter>
    {
        const result = await this._apiClient.get(`distribution-centers/${id}`,
            {
                signal
            });

        return new DistributionCenter(result.data);
    }

    /**
     * Create the specified distribution center.
     * @param distributionCenter The distribution center to create.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the created distribution center.
     */
    public async create(distributionCenter: DistributionCenter, signal?: AbortSignal): Promise<DistributionCenter>
    {
        const result = await this._apiClient.post(`distribution-centers`,
            {
                body: distributionCenter,
                signal
            });

        return new DistributionCenter(result.data);
    }

    /**
     * Updates the specified distribution center.
     * @param distributionCenter The distribution center to update.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the updated distribution center.
     */
    public async update(distributionCenter: DistributionCenter, signal?: AbortSignal): Promise<DistributionCenter>
    {
        const result = await this._apiClient.post(`distribution-centers/update`,
            {
                body: distributionCenter,
                signal
            });

        return new DistributionCenter(result.data);
    }

    /**
     * Deletes the specified distribution center.
     * @param id The ID of the distribution center to delete.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async delete(id: string): Promise<void>
    {
        await this._apiClient.post(`distribution-centers/${id}/delete`);
    }

    /**
     * Gets the routes associated with the specified distribution center on the specified date.
     * @param id The ID of the distribution center for which to get routes.
     * @param fromDate The first date and time for which to get routes.
     * @param toDate The last date and time for which to get routes.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the routes.
     */
    public async getRoutes(distributionCenterId: string, toDate: DateTime, fromDate: DateTime, signal?: AbortSignal): Promise<DistributionCenterRoute[]>
    {
        const result = await this._apiClient.get("distribution-centers/routes/list",
        {
            query:
            {
                distributionCenterId: distributionCenterId,
                fromDate: fromDate.toISO({ includeOffset: false }),
                toDate: toDate.toISO({ includeOffset: false })
            },
            signal
        });

        return result.data.map(route => new DistributionCenterRoute(route));
    }

    /**
     * Saves the remarks associated with the specified route.
     * @param distributionCenterId The ID of the distribution center associated with the route.
     * @param routeId The ID of the route for which remarks should be saved.
     * @param driverId The ID of the driver associated with the route.
     * @param remarks The remarks associated with the route.
     * @param note The note associated with the remarks, if any.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async saveRouteRemarks(distributionCenterId: string, routeId: string, driverId: string, remarks: DistributionCenterRouteRemark[], note?: string): Promise<void>
    {
        await this._apiClient.post("distribution-centers/routes/save-remarks",
        {
            body:
            {
                routeId: routeId,
                depotId: distributionCenterId,
                driverId: driverId,
                remarkCodes: remarks.map(r => r.code),
                note: note
            }
        });
    }
}
