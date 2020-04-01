import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { CommunicationTriggerInfo } from "../entities/communication-trigger-info";
import { CommunicationTrigger } from "../entities/communication-trigger";
import { Metadata } from "app/model/shared/entities/metadata";
import { CommunicationTriggerEventSlug } from "../entities/communication-trigger-event";
import optionsForTriggerEvents from "../resources/settings/options-for-trigger-events";

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
     * Gets the available options for the specified trigger event.
     * @param triggerEventSlug The slug identifying the trigger event.
     * @returns The available options.
     */
    public getOptions(triggerEventSlug: CommunicationTriggerEventSlug): any
    {
        return optionsForTriggerEvents[triggerEventSlug];
    }

    /**
     * Gets all communication triggers visible to the current user.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the communication triggers.
     */
    public async getAll(signal?: AbortSignal): Promise<CommunicationTriggerInfo[]>
    {
        const result = await this._apiClient.post("communication/triggers/list",
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
        const result = await this._apiClient.post("communication/triggers/details",
        {
            body: { slug }
        });

        return new CommunicationTrigger(result.data);
    }

    /**
     * Updates the specified communication trigger.
     * @param trigger The communication trigger to save.
     * @returns A promise that will be resolved when the operation completes.
     */
    public async update(trigger: CommunicationTrigger): Promise<void>
    {
        const result = await this._apiClient.post("communication/triggers/update",
        {
            body: trigger
        });

        trigger.id = result.data.id;
        trigger.slug = result.data.slug;
        trigger.metadata = new Metadata(result.data.metadata);
    }

    /**
     * Creates the specified communication trigger.
     * @param trigger The communication trigger to save.
     * @returns A promise that will be resolved when the operation completes.
     */
    public async create(trigger: CommunicationTrigger): Promise<void>
    {
        const result = await this._apiClient.post("communication/triggers/update",
        {
            body: trigger
        });

        trigger.id = result.data.id;
        trigger.slug = result.data.slug;
        trigger.metadata = new Metadata(result.data.metadata);
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
