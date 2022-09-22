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

        await this.apiClient.post(`linehaulservice-api/v1/organizations/${context.user?.organizationId}/linehauls`,
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

        const result = await this.apiClient.post("linehauls/details",
        {
            body:
            {
                reference: context.params.id,
                outfitId: context.user?.organizationId,
                actionById: context.user?.id
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Finalise the linehaul
     * @param context.params.id The ID of the linehaul to get.
     * @returns The linehaul with the specified reference.
     */
    public "GET /v2/linehauls/unload-finalize/:id" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.post("linehauls/unloadFinalize",
        {
            body:
            {
                id: context.params.id,
                outfitId: context.user?.organizationId,
                actionById: context.user?.id
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Saves the load event
     * @returns 202 ok
     */
    public "POST /v2/linehauls/collo/load" = async (context: AppContext) =>
    {
        await context.authorize();

        const routesResult = await this.apiClient.post("linehauls/collo/load",
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
