import { AppContext } from "../../app-context";
import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to views.
 */
export class ViewsModule extends AppModule
{
    /**
     * Gets the views of the specified type, associated with the current organization.
     * @param context.request.query.type The type of views to get.
     * @returns
     * - 200: The views of the specified type, associated with the current organization.
     */
    public "GET /v2/views" = async (context: AppContext) =>
    {
        const type = context.request.query.type;

        // TODO: Should we add a `view-{type}-views` permission?
        await context.authorize();

        const result = await this.apiClient.get("views/list",
        {
            headers: { "x-organization": context.user?.organizationId },
            query: { type }
        });

        context.response.body = result.data.map((data: any) => ({ ...data, state: JSON.parse(data.state) }));
        context.response.status = 200;
    }

    /**
     * Creates the specified view, associated with the current organization.
     * @param context.request.body The data representing the view to create.
     * @returns
     * - 200: The new view.
     */
    public "POST /v2/views/create" = async (context: AppContext) =>
    {
        const type = context.request.body?.type;

        await context.authorize(`edit-${type}-views`);

        const result = await this.apiClient.post("views/create",
        {
            headers: { "x-organization": context.user?.organizationId },
            body: { ...context.request.body, state: JSON.stringify(context.request.body.state) }
        });

        context.response.body = { ...result.data, state: JSON.parse(result.data.state) };
        context.response.status = 200;
    }

    /**
     * Updates the specified view, associated with the current organization.
     * @param context.request.body The data representing the view to update.
     * @returns
     * - 200: The updated view.
     */
    public "POST /v2/views/:id/update" = async (context: AppContext) =>
    {
        const type = context.request.body?.type;

        await context.authorize(`edit-${type}-views`);

        const result = await this.apiClient.post(`views/${context.params.id}/update`,
        {
            headers: { "x-organization": context.user?.organizationId },
            body: { ...context.request.body, state: JSON.stringify(context.request.body.state) }
        });

        context.response.body = { ...result.data, state: JSON.parse(result.data.state) };
        context.response.status = 200;
    }

    /**
     * Deletes the specified view, associated with the current organization.
     * @param context.params.id The ID of the view to delete.
     * @param context.request.body.type The type of views to get.
     * @returns
     * - 204: No content
     */
    public "POST /v2/views/:id/delete" = async (context: AppContext) =>
    {
        const type = context.request.body?.type;

        await context.authorize(`edit-${type}-views`);

        const result = await this.apiClient.post(`views/${context.params.id}/delete`,
        {
            headers: { "x-organization": context.user?.organizationId }
        });

        context.response.body = result.data;
        context.response.status = 204;
    }
}
