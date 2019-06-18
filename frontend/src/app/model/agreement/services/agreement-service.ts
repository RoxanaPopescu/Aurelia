import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { IPaging, ISorting } from "shared/types";
import { Outfit } from "app/model/outfit";

/**
 * Represents a service that manages agreements.
 */
@autoinject
export class AgreementService
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
     * Gets all agreements associated with the current user.
     * @param sorting The sorting options to use.
     * @param paging The paging options to use.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the agreements.
     */
    public async getAll(sorting?: ISorting, paging?: IPaging, signal?: AbortSignal): Promise<{ agreements: Outfit[]; agreementCount: number }>
    {
        const result1 = await this._apiClient.get("agreements/fulfillers/list",
        {
            signal
        });

        const result2 = await this._apiClient.get("agreements/fulfilees/list",
        {
            signal
        });

        const resultData = [...result1.data, ...result2.data];

        return {
            agreements: resultData.map((data: any) => new Outfit(data)),
            agreementCount: resultData.length
        };
    }
}
