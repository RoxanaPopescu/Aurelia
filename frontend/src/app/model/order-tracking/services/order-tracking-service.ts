import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { IdentityService } from "app/services/identity";
import { OrderTrackingSettings } from "../entities/order-tracking-settings";

/**
 * Represents a service for managing order tracking settings.
 */
@autoinject
export class OrderTrackingService
{
    /**
     * Creates a new instance of the type.
     * @param identityService The `IdentityService` instance.
     * @param apiClient The `ApiClient` instance.
     */
    public constructor(identityService: IdentityService, apiClient: ApiClient)
    {
        this._apiClient = apiClient;
        this._identityService = identityService;
    }

    private readonly _apiClient: ApiClient;
    private readonly _identityService: IdentityService;

    /**
     * Gets the order tracking settings for the current organization.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the order tracking settings for the organization.
     */
    public async getSettings(signal?: AbortSignal): Promise<OrderTrackingSettings>
    {
        const organizationId = this._identityService.identity!.organization!.id;

        const result = await this._apiClient.get(`order-tracking/settings/${organizationId}`,
        {
            signal
        });

        return new OrderTrackingSettings(result.data);
    }

    /**
     * Saves the order tracking settings for the current organization.
     * @param settings The order tracking settings to save.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async saveSettings(settings: OrderTrackingSettings): Promise<void>
    {
        const organizationId = this._identityService.identity!.organization!.id;

        await this._apiClient.post(`order-tracking/settings/${organizationId}/save`,
        {
            body: settings
        });
    }
}
