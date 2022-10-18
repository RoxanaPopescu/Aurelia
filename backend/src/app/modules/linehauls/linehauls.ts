import { AppContext } from "../../app-context";
import { AppModule } from "../../app-module";
import { v4 as uuidV4 } from "uuid";

/**
 * Represents a module exposing endpoints related to linehauls.
 */
export class LinehaulsModule extends AppModule
{
    /**
     * Creates a linehaul with a auto generated GUID reference
     * @returns The created linehaul.
     */
    public "POST /v2/linehauls" = async (context: AppContext) =>
    {
        await context.authorize();

        await this.apiClient.post("linehaulservice-api/v1/linehauls/create",
        {
            body:
            {
                id: uuidV4()
            }
        });

        context.response.status = 204;
    }

    /**
     * Get a specific linehaul
     * @param context.params.id The ID of the linehaul to get.
     * @returns The linehaul with the specified id.
     * @returns 400 if not found.
     */
    public "GET /v2/linehauls/:id" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.get("linehauls/find-by-id",
        {
            query:
            {
                id: context.params.id,
                ownerId: context.params.ownerId ?? context.user?.organizationId
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Saves the load event
     * @returns 202 OK
     */
     public "POST /v2/linehauls/load-collo" = async (context: AppContext) =>
     {
         await context.authorize();

         // TODO: Fetch order data from order domain. by barcode.

         const body = context.request.body;
         body.linehaul.ownerId = context.user?.organizationId;

         const routesResult = await this.apiClient.post("linehauls/load-collo",
         {
             body:
             {
                 ...body
             }
         });

         context.response.body = routesResult.data;
         context.response.status = 200;
     }

    /**
     * Saves the unload event
     * @returns 202 ok
     */
    public "POST /v2/linehauls/collo/unload" = async (context: AppContext) =>
    {
        await context.authorize();

        const routesResult = await this.apiClient.post("linehauls/collo/unload",
        {
            body:
            {
                ...context.request.body,
                outfitId: context.user?.organizationId,
                actionById: context.user?.id
            }
        });

        context.response.body = routesResult.data;
        context.response.status = 200;
    }

    /**
     * Saves the damaged event
     * @returns 202 ok
     */
    public "POST /v2/linehauls/collo/damaged" = async (context: AppContext) =>
    {
        await context.authorize();

        const routesResult = await this.apiClient.post("linehauls/collo/damaged",
        {
            body:
            {
                ...context.request.body,
                outfitId: context.user?.organizationId,
                actionById: context.user?.id
            }
        });

        context.response.body = routesResult.data;
        context.response.status = 200;
    }

    /**
     * Saves the missing event
     * @returns 202 ok
     */
    public "POST /v2/linehauls/collo/missing" = async (context: AppContext) =>
    {
        await context.authorize();

        const routesResult = await this.apiClient.post("linehauls/collo/missing",
        {
            body:
            {
                ...context.request.body,
                outfitId: context.user?.organizationId,
                actionById: context.user?.id
            }
        });

        context.response.body = routesResult.data;
        context.response.status = 200;
    }

    /**
     * Saves the removed event
     * @returns 202 ok
     */
    public "POST /v2/linehauls/collo/remove" = async (context: AppContext) =>
    {
        await context.authorize();

        const routesResult = await this.apiClient.post("linehauls/collo/remove",
        {
            body:
            {
                ...context.request.body,
                outfitId: context.user?.organizationId,
                actionById: context.user?.id
            }
        });

        context.response.body = routesResult.data;
        context.response.status = 200;
    }
}
