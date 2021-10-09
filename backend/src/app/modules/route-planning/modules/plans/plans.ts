import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to tracking.
 */
export class RoutePlanningPlansModule extends AppModule
{
    public configure(): void
    {
        /**
         * Gets the jobs for automatic dispatch
         * @returns The a list of jobs.
         */
        this.router.post("/v2/route-planning/plans/list", async context =>
        {
            await context.authorize("view-routeplans");

            const body = context.request.body;
            body.outfitIds = [context.user?.organizationId];

            const result = await this.apiClient.post("routeoptimization/List",
            {
                body: body
            });

            context.response.body = result.data;
            context.response.status = 200;
        });
    }
}
