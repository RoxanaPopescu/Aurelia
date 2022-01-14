import { AppContext } from "../../app-context";
import { AppModule } from "../../app-module";

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

        const result = await this.apiClient.get("automatic-dispatch-settings",
        {
            headers: { "ownerId": context.user?.organizationId }
        });

        context.response.body = result.data;
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

        const result = await this.apiClient.get(`automatic-dispatch-settings/${context.params.id}`,
        {
            headers: { "ownerId": context.user?.organizationId }
        });

        context.response.body = result.data;
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

        const result = await this.apiClient.post(`automatic-dispatch-settings/create`,
        {
            headers: { "ownerId": context.user?.organizationId },
            body: context.request.body
        });

        context.response.body = result.data;
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

        const result = await this.apiClient.post(`automatic-dispatch-settings/${context.params.id}/update`,
        {
            headers: { "ownerId": context.user?.organizationId },
            body: context.request.body
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Deletes the specified automatic dispatch settings.
     * @param context.params.id The ID of the automatic dispatch settings to delete.
     */
    public "POST /v2/automatic-dispatch/settings/:id/delete" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        await this.apiClient.post(`automatic-dispatch-settings/${context.params.id}/delete`,
        {
            headers: { "ownerId": context.user?.organizationId }
        });

        context.response.status = 201;
    }

    /**
     * Pauses the specified automatic dispatch settings.
     * @param context.params.id The ID of the automatic dispatch settings to pause.
     * @returns The updated automatic dispatch settings.
     */
    public "POST /v2/automatic-dispatch/settings/:id/pause" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        const result = await this.apiClient.post(`automatic-dispatch-settings/${context.params.id}/pause`,
        {
            headers: { "ownerId": context.user?.organizationId }
        });

        context.response.body = result.data;
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

        const result = await this.apiClient.post(`automatic-dispatch-settings/${context.params.id}/unpause`,
        {
            headers: { "ownerId": context.user?.organizationId }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Starts a new dispatch job immediately, using the specified automatic dispatch settings.
     * @param context.params.id The ID of the automatic dispatch settings to use.
     */
    public "POST /v2/automatic-dispatch/settings/:id/run-now" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        await this.apiClient.post(`automatic-dispatch-settings/${context.params.id}/run-now`,
        {
            headers: { "ownerId": context.user?.organizationId }
        });

        context.response.status = 201;
    }
}
