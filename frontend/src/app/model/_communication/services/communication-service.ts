import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { CommunicationTriggerInfo } from "../entities/communication-trigger-info";
import { CommunicationTrigger } from "../entities/communication-trigger";

/**
 * Represents a service that manages communication triggers.
 */
@autoinject
export class CommunicationService
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
     * Gets all communication triggers visible to the current user.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the communication triggers.
     */
    public async getAll(signal?: AbortSignal): Promise<CommunicationTriggerInfo[]>
    {
        const result = await this._apiClient.get("communication/triggers/list",
        {
            signal
        });

        return result.data.map((data: any) => new CommunicationTriggerInfo(data));
    }

    /**
     * Gets the specified communication trigger.
     * @param slug The slug identifying the communication trigger.
     * @returns A promise that will be resolved with the communication trigger.
     */
    public async get(slug: string): Promise<CommunicationTrigger>
    {
        const result = await this._apiClient.get("communication/triggers/details",
        {
            query: { slug }
        });

        return new CommunicationTrigger(result.data);
    }

    /**
     * Deletes the specified communication trigger.
     * @param slug The slug identifying the communication trigger to delete.
     * @returns A promise that will be resolved when the operation completes.
     */
    public async delete(slug: string): Promise<void>
    {
        await this._apiClient.post("communication/triggers/delete",
        {
            body: { slug }
        });
    }
}
