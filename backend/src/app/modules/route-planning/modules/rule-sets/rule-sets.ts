import { AppContext } from "app/app-context";
import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to tracking.
 */
export class RoutePlanningRuleSetsModule extends AppModule
{
    /**
     * Gets the rule-sets for route planning
     * @returns The a list of rule-sets.
     */
    public "GET /v2/route-planning/rule-sets" = async (context: AppContext) =>
    {
        await context.authorize("view-routeplan-settings");

        const body = context.request.body ?? {};
        body.outfitIds = [context.user?.organizationId];

        const result = await this.apiClient.post("routeoptimization/settings/list",
        {
            body: body
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Gets the rule-set by ID.
     * @param context.params.slug The slug of the rule set to receive.
     * @returns The rule set of the specified ID.
     */
    public "GET /v2/route-planning/rule-sets/:slug" = async (context: AppContext) =>
    {
        await context.authorize("view-routeplan-settings");

        const result = await this.apiClient.post("routeoptimization/settings/details",
        {
            body:
            {
                outfitIds: [context.user?.organizationId],
                slug: context.params.slug
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Creates a ruleset
     * @returns The created rule-set.
     */
    public "POST /v2/route-planning/rule-sets" = async (context: AppContext) =>
    {
        await context.authorize("create-routeplan-settings");

        const body = context.request.body;
        body.ownerId = context.user?.organizationId;
        body.createdBy = context.user?.id;
        body.updatedBy = context.user?.id;

        const createResult = await this.apiClient.post("routeoptimization/settings/add",
        {
            body: body
        });

        const result = await this.apiClient.post("routeoptimization/settings/details",
        {
            body:
            {
                outfitIds: [context.user?.organizationId],
                slug: createResult.data.slug
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Updates a rule-set
     * @returns The updated rule-set.
     */
    public "POST /v2/route-planning/rule-sets/update" = async (context: AppContext) =>
    {
        await context.authorize("edit-routeplan-settings");

        const body = context.request.body;
        body.accessOutfitIds = [context.user?.organizationId];
        body.updatedBy = context.user?.id;

        const updateResult = await this.apiClient.post("routeoptimization/settings/edit",
        {
            body: body
        });

        const result = await this.apiClient.post("routeoptimization/settings/details",
        {
            body:
            {
                outfitIds: [context.user?.organizationId],
                slug: updateResult.data.slug
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Deletes a rule-set
     * @returns 200 OK.
     */
    public "POST /v2/route-planning/rule-sets/delete" = async (context: AppContext) =>
    {
        await context.authorize("edit-routeplan-settings");

        const result = await this.apiClient.post("routeoptimization/settings/delete",
        {
            body:
            {
                outfitIds: [context.user?.organizationId],
                id: context.request.body.id
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }
}
