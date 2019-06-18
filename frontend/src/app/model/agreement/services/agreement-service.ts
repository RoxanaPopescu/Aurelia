import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { IPaging, ISorting } from "shared/types";
import { Outfit } from "app/model/outfit";
import { FulfillerAgreementInvite } from "../entities/fulfiller-invite";

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
     * Gets all outfits with whom the current outfit has an agreement.
     * @param sorting The sorting options to use.
     * @param paging The paging options to use.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the agreements.
     */
    public async getAll(sorting?: ISorting, paging?: IPaging, signal?: AbortSignal): Promise<{ agreements: Outfit[]; agreementCount: number }>
    {
        const fulfillersResult = await this._apiClient.get("agreements/fulfillers/list",
        {
            signal
        });

        const fulfileesResult = await this._apiClient.get("agreements/fulfilees/list",
        {
            signal
        });

        const resultData = [...fulfillersResult.data, ...fulfileesResult.data];

        return {
            agreements: resultData.map((data: any) => new Outfit(data)),
            agreementCount: resultData.length
        };
    }

    /**
     * Creates a new agreement and invites the specified fulfiller.
     * @param invite The invite to send.
     * @returns A promise that will be resolved when the invitation has been sent.
     */
    public async inviteFulfiller(invite: FulfillerAgreementInvite): Promise<void>
    {
        await this._apiClient.post("agreements/fulfillers/invite",
        {
            body: invite
        });
    }
}
