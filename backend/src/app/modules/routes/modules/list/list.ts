import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to route list
 */
export class RoutesListModule extends AppModule
{
    /**
     * Configures the module.
     */
    public configure(): void
    {
        /**
         * Get the list of routes
         * @returns list of routes
         */
        this.router.post("/v2/routes/list", async context =>
        {
            await context.authorize("view-routes");

            const body = context.request.body;
            body.includeTotalCount = false;
            body.fulfillerIds = [context.user?.organizationId];
            body.organizationId = context.user?.organizationId;
            body.teamIds = ["80302a70-d32c-4e2d-bc2b-e2ce00e76f45"];

            const result = await this.apiClient.post("logistics-platform/routes/v4/list",
            {
                noi: true,
                body: body
            });

            const data = result.data;

            if (body.include.fulfiller != null && body.include.fulfiller)
            {
                const organizatonIds = data.routes.map((r: any) => r.fulfiller.id);
                const fulfillerResult = await this.apiClient.post("logistics/outfits/fulfiller/list",
                {
                    body: {
                        ids: organizatonIds
                    }
                });
                const fulfillers = fulfillerResult.data.results;

                for (const route of data.routes)
                {
                    const id = route.fulfiller.id;
                    const fulfuller = fulfillers.find((f: any) => f.id === id);
                    if (fulfuller != null)
                    {
                        route.fulfiller = fulfuller;
                    }
                    else
                    {
                        delete route.fulfiller;
                    }
                }
            }

            context.response.body = data;
            context.response.status = 200;
        });
    }
}
