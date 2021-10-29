import { AppModule } from "../../app-module";
import { v4 as uuidV4 } from "uuid";
import { AppContext } from "app/app-context";

/**
 * Represents a module exposing endpoints related to distribution centers.
 */
export class DistributionCenterModule extends AppModule
{
    /**
     * Creates a distribution center
     * @returns The created distribution center.
     */
    public "POST /v2/distribution-centers" = async (context: AppContext) =>
    {
        await context.authorize("create-distribution-centers");

        const body = context.request.body;
        body.ownerId = context.user?.organizationId;
        body.createdBy = context.user?.id;
        body.id = uuidV4();

        await this.apiClient.post("logistics/depots/create",
        {
            body: body
        });

        context.response.body = body;
        context.response.status = 200;
    }

    /**
     * Updates a distribution center
     * @returns 200 OK.
     */
    public "POST /v2/distribution-centers/update" = async (context: AppContext) =>
    {
        await context.authorize("edit-distribution-centers");

        const body = context.request.body;
        body.createdBy = context.user?.id;

        const result = await this.apiClient.post("logistics/depots/update",
        {
            body: body
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Gets the list of distribution centers.
     * @returns The list of distribution centers.
     */
    public "GET /v2/distribution-centers" = async (context: AppContext) =>
    {
        await context.authorize("view-distribution-centers");

        const result = await this.apiClient.post("logistics/depots/list",
        {
            body:
            {
                ownerIds: [context.user?.organizationId]
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Gets the distribution center with the specified ID.
     * @param context.params.id The ID of the distribution center to get.
     * @returns The distribution center with the specified ID.
     */
    public "GET /v2/distribution-centers/:id" = async (context: AppContext) =>
    {
        await context.authorize("view-distribution-centers");

        const result = await this.apiClient.post("logistics/depots/details",
        {
            body:
            {
                id: context.params.id
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }
}
