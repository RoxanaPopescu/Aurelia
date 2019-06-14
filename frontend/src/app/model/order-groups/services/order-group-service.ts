import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { IPaging, ISorting } from "shared/types";
import { OrderGroupInfo } from "app/model/order-groups";

/**
 * Represents a service that manages order groups used for route planning.
 */
@autoinject
export class OrderGroupService
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
     * Gets all order groups associatd with the current outfit.
     * @param sorting The sorting options to use.
     * @param paging The paging options to use.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the order groups.
     */
    public async getAll(sorting?: ISorting, paging?: IPaging, signal?: AbortSignal): Promise<{ orderGroups: OrderGroupInfo[]; orderGroupCount: number }>
    {
        const result = await this._apiClient.get("ordergroups/list",
        {
            signal
        });

        return {
            orderGroups: result.data.map((data: any) => new OrderGroupInfo(data)),
            orderGroupCount: result.data.length
        };
    }
}
