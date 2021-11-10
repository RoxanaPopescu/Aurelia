import { v4 as uuidV4 } from "uuid";
import { AppContext } from "../../../../../../app-context";
import { AppModule } from "../../../../../../app-module";

/**
 * Represents a module exposing endpoints related to automatic contractor route assignment
 */
export class DispatchRouteModule extends AppModule
{
    /**
     * The automatic contractor rules
     * @returnsA A list of the automatic contractor rules
     */
    public "GET /v2/dispatch/route/automatic-contractor" = async (context: AppContext) =>
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
     * Updated the automatic contractor rules
     * @returnsA A list of the automatic contractor rules
     */
    public "POST /v2/dispatch/route/automatic-contractor/save" = async (context: AppContext) =>
    {
        await context.authorize("edit-automatic-organization-route-assignments");

        const body: any = context.request.body;
        body.outfitId = context.user?.organizationId;
        body.createdBy = context.user?.id;
        let endpoint: string;

        if (body.id == null)
        {
            body.id = uuidV4();
            endpoint = "create";
        }
        else
        {
            endpoint = "update";
        }

        await this.apiClient.post(`logistics/dispatch/settings/fulfillers/${endpoint}`,
        {
            body: body
        });

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
     * Deletes a specpfic automatic contractor
     * @returnsA A list of the automatic contractor rules
     */
    public "POST /v2/dispatch/route/automatic-contractor/delete" = async (context: AppContext) =>
    {
        await context.authorize("edit-automatic-organization-route-assignments");

        const result = await this.apiClient.post("logistics/dispatch/settings/fulfillers/delete",
        {
            body: {
                id: context.request.body.ruleId,
                outfitIds: [context.user?.organizationId],
                deletedBy: context.user?.id
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }
}
