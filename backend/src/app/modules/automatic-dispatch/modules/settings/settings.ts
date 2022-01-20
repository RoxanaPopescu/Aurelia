import { ApiError } from "../../../../../shared/infrastructure";
import { AppContext } from "../../../../app-context";
import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to automatic dispatch settings.
 */
export class AutomaticDispatchSettingsModule extends AppModule
{
    /**
     * Gets the automatic dispatch settings.
     * @returns The a list of automatic dispatch settings.
     */
    public "GET /v2/automatic-dispatch/settings" = async (context: AppContext) =>
    {
        await context.authorize("view-routes");

        const result = await this.apiClient.get("automatic-dispatch-settings/settings",
        {
            headers: { "ownerId": context.user!.organizationId }
        });

        context.response.body = result.data.settings;
        context.response.status = 200;
    }

    /**
     * Gets the specified automatic dispatch settings.
     * @param context.params.id The ID of the automatic dispatch settings to get.
     * @returns The automatic dispatch settings.
     */
    public "GET /v2/automatic-dispatch/settings/:id" = async (context: AppContext) =>
    {
        await context.authorize("view-routes");

        await this.apiClient.get(`automatic-dispatch-settings/settings/${context.params.id}`,
        {
            headers: { "ownerId": context.user!.organizationId }
        });

        const settings = await this.getDetails(context.user!.organizationId, context.params.id);

        context.response.body = settings;
        context.response.status = 200;
    }

    /**
     * Creates the specified automatic dispatch settings.
     * @param context.request.body The new automatic dispatch settings.
     * @returns The new automatic dispatch settings.
     */
    public "POST /v2/automatic-dispatch/settings/create" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        const result = await this.apiClient.post("automatic-dispatch-settings/settings/create",
        {
            headers: { "ownerId": context.user!.organizationId },
            body: context.request.body
        });

        const settings = await this.getDetails(context.user!.organizationId, result.data.id);

        context.response.body = settings;
        context.response.status = 200;
    }

    /**
     * Updates the specified automatic dispatch settings.
     * @param context.params.id The ID of the automatic dispatch settings to update.
     * @param context.request.body The updated automatic dispatch settings.
     * @returns The updated automatic dispatch settings.
     */
    public "POST /v2/automatic-dispatch/settings/:id/update" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        await this.apiClient.post(`automatic-dispatch-settings/settings/${context.params.id}/update`,
        {
            headers: { "ownerId": context.user!.organizationId },
            body: context.request.body
        });

        const settings = await this.getDetails(context.user!.organizationId, context.params.id);

        context.response.body = settings;
        context.response.status = 200;
    }

    /**
     * Deletes the specified automatic dispatch settings.
     * @param context.params.id The ID of the automatic dispatch settings to delete.
     */
    public "POST /v2/automatic-dispatch/settings/:id/delete" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        await this.apiClient.post(`automatic-dispatch-settings/settings/${context.params.id}/delete`,
        {
            headers: { "ownerId": context.user!.organizationId }
        });

        context.response.status = 204;
    }

    /**
     * Pauses the specified automatic dispatch settings.
     * @param context.params.id The ID of the automatic dispatch settings to pause.
     * @returns The updated automatic dispatch settings.
     */
    public "POST /v2/automatic-dispatch/settings/:id/pause" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        await this.apiClient.post(`automatic-dispatch-settings/settings/${context.params.id}/pause`,
        {
            headers: { "ownerId": context.user!.organizationId }
        });

        const settings = await this.getDetails(context.user!.organizationId, context.params.id);

        context.response.body = settings;
        context.response.status = 200;
    }

    /**
     * Uppauses the specified automatic dispatch settings.
     * @param context.params.id The ID of the automatic dispatch settings to unpause.
     * @returns The updated automatic dispatch settings.
     */
    public "POST /v2/automatic-dispatch/settings/:id/unpause" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        await this.apiClient.post(`automatic-dispatch-settings/settings/${context.params.id}/unpause`,
        {
            headers: { "ownerId": context.user!.organizationId }
        });

        const settings = await this.getDetails(context.user!.organizationId, context.params.id);

        context.response.body = settings;
        context.response.status = 200;
    }

    /**
     * Starts a new dispatch job immediately, using the specified automatic dispatch settings.
     * @param context.params.id The ID of the automatic dispatch settings to use.
     * @returns An object with the ID of the new dispatch job, or status 409 if no job could be created.
     */
    public "POST /v2/automatic-dispatch/settings/:id/run-now" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        // HACK: We do not currently have an endpoint to run a rule set, so we abuse the old start manual instead.

        const settings = await this.getDetails(context.user!.organizationId, context.params.id);

        try
        {
            const result = await this.apiClient.post("automatic-dispatch-orchestrator/jobs",
            {
                headers: { "ownerId": context.user?.organizationId },
                body:
                {
                    name: settings.name,
                    filters:
                    {
                        shipments: settings.shipmentFilter == null ? undefined :
                        {
                            organizationIds: settings.shipmentFilter.organizationIds,
                            vehicleTypes: settings.shipmentFilter.vehicleTypeIds,
                            pickupTime: settings.shipmentFilter.pickupLeadTime
                        },
                        routes: settings.routeFilter == null ? undefined :
                        {
                            organizationIds: settings.routeFilter.organizationIds,
                            tags: settings.routeFilter.tags,
                            pickupTime: settings.routeFilter.startLeadTime
                        }
                    }
                }
            });

            context.response.body = result.data;
            context.response.status = 200;
        }
        catch (error)
        {
            if (error instanceof ApiError && error.response?.status === 404)
            {
                context.response.status = 409;
            }
            else
            {
                throw error;
            }
        }
    }

    /**
     * Gets the specified automatic dispatch settings.
     * @param organizationId The ID of the organization owning the automatic dispatch settings.
     * @param settingsId The ID of the automatic dispatch settings to get.
     * @returns The automatic dispatch settings.
     */
    private async getDetails(organizationId: string, settingsId: string): Promise<any>
    {
        const result = await this.apiClient.get(`automatic-dispatch-settings/settings/${settingsId}`,
        {
            headers: { "ownerId": organizationId }
        });

        return result.data;
    }
}
