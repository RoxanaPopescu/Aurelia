import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { IPaging, ISorting } from "shared/types";
import { VehicleService } from "app/model/vehicle";
import { ExpressOrderInfo } from "../entities/express-order-info";
import { getLegacyOrderSortProperty, getLegacySortDirection } from "legacy/helpers/api-helper";

/**
 * Represents a service that manages express orders.
 */
@autoinject
export class ExpressOrderService
{
    /**
     * Creates a new instance of the type.
     * @param apiClient The `ApiClient` instance.
     * @param vehicleService The `VehicleService` instance.
     */
    public constructor(apiClient: ApiClient, vehicleService: VehicleService)
    {
        this._apiClient = apiClient;
        this._vehicleService = vehicleService;
    }

    private readonly _apiClient: ApiClient;
    private readonly _vehicleService: VehicleService;

    /**
     * Gets all express orders visible to the current user.
     * @param textFilter The order text to filter by, or undefined to apply no text filter.
     * @param sorting The sorting options to use.
     * @param paging The paging options to use.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the orders.
     */
    public async getAll(textFilter?: string, sorting?: ISorting, paging?: IPaging, signal?: AbortSignal): Promise<{ orders: ExpressOrderInfo[]; orderCount: number }>
    {
        const result = await this._apiClient.post("express-orders/query",
        {
            body:
            {
                page: paging ? paging.page : undefined,
                pageSize: paging ? paging.pageSize : undefined,
                sorting: sorting ? [{ field: getLegacyOrderSortProperty(sorting.property), direction: getLegacySortDirection(sorting.direction) }] : [],
                filter: textFilter ? [textFilter] : undefined
            },
            signal
        });

        const vehicleTypes = await this._vehicleService.getTypes();

        return {
            orders: result.data.map((data: any) =>
            {
                const vehicleType = vehicleTypes.find(vt => vt.id === data.vehicleTypeId);

                return new ExpressOrderInfo(data, vehicleType!);
            }),
            orderCount: result.data.totalCount
        };
    }
}
