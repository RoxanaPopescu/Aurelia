import { v4 as uuidV4 } from "uuid";
import { AppContext } from "../../../../../../app-context";
import { AppModule } from "../../../../../../app-module";

/**
 * Represents a module exposing endpoints related to automatic contractor assignment.
 */
export class AutomaticContractorAssignmentModule extends AppModule
{
    /**
     * Gets the automatic contractor assignment rules.
     * @returns An array representing the automatic contractor assignment rules.
     */
    public "GET /v2/dispatch/route/automatic-contractor/list" = async (context: AppContext) =>
    {
        await context.authorize("view-automatic-organization-route-assignments");

        const result = await this.apiClient.post("logistics/dispatch/settings/fulfillers/list",
        {
            body: {
                outfitIds: [context.user?.organizationId]
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Creates the specified automatic contractor assignment rule.
     * @returns The created automatic contractor assignment rule.
     */
    public "POST /v2/dispatch/route/automatic-contractor/create" = async (context: AppContext) =>
    {
        await context.authorize("edit-automatic-organization-route-assignments");

        const body: any = context.request.body;
        body.outfitId = context.user?.organizationId;
        body.createdBy = context.user?.id;
        body.id = uuidV4();

        await this.apiClient.post(`logistics/dispatch/settings/fulfillers/create`,
        {
            body: body
        });

        context.response.body = body;
        context.response.status = 200;
    }

    /**
     * Updates the specified automatic contractor assignment rule.
     * @returns The updated automatic contractor assignment rule.
     */
    public "POST /v2/dispatch/route/automatic-contractor/update" = async (context: AppContext) =>
    {
        await context.authorize("edit-automatic-organization-route-assignments");

        const body: any = context.request.body;
        body.outfitId = context.user?.organizationId;
        body.createdBy = context.user?.id;

        await this.apiClient.post(`logistics/dispatch/settings/fulfillers/update`,
        {
            body: body
        });

        context.response.body = body;
        context.response.status = 200;
    }

    /**
     * Deletes a specpfic automatic contractor
     */
    public "POST /v2/dispatch/route/automatic-contractor/delete" = async (context: AppContext) =>
    {
        await context.authorize("edit-automatic-organization-route-assignments");

        await this.apiClient.post("logistics/dispatch/settings/fulfillers/delete",
        {
            body: {
                id: context.request.body.ruleId,
                outfitIds: [context.user?.organizationId],
                deletedBy: context.user?.id
            }
        });

        context.response.status = 200;
    }
}
