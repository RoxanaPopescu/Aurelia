import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { IPaging, ISorting } from "shared/types";
import { Outfit } from "app/model/outfit";

/**
 * Represents a service that manages departments.
 */
@autoinject
export class DepartmentService
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
     * Gets all departments associated with the current user.
     * @param sorting The sorting options to use.
     * @param paging The paging options to use.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the departments.
     */
    public async getAll(sorting?: ISorting, paging?: IPaging, signal?: AbortSignal): Promise<{ departments: Outfit[]; departmentCount: number }>
    {
        const result = await this._apiClient.get("departments/list",
        {
            signal
        });

        return {
            departments: result.data.map((data: any) => new Outfit(data)),
            departmentCount: result.data.length
        };
    }
}
