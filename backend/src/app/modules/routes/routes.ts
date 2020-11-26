import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to routes.
 */
export class RoutesModule extends AppModule
{
    public configure(): void
    {
        /**
         * Creates a route from a template.
         * @returns The ID and slug of the new route.
         */
        this.router.post("/v2/routes/create-from-template", async context =>
        {
            context.authorize("create-route-template");

            const routesResult = await this.apiClient.post("route-template-orchestrator/create-route",
            {
                body:
                {
                    ...context.request.body,
                    ownerId: context.user?.outfitId,
                    changedById: context.user?.id
                }
            });

            context.response.body = routesResult.data;
            context.response.status = 200;
        });
    }
}
