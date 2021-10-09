import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to tracking.
 */
export class RoutePlanningOrderGroupsModule extends AppModule
{
    public configure(): void
    {
        /**
         * Gets the jobs for automatic dispatch
         * @returns The a list of jobs.
         */
        this.router.get("/v2/route-planning/order-groups", async context =>
        {
            await context.authorize("view-routeplan-settings");

            const body = context.request.body;
            body.outfitIds = [context.user?.organizationId];
            body.ownerOutfitId = context.user?.organizationId;

            const result = await this.apiClient.post("routeoptimization/settings/list",
            {
                body: body
            });

            context.response.body = result.data;
            context.response.status = 200;
        });
    }
}
