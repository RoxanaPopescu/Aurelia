import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to tracking.
 */
export class KpiModule extends AppModule
{
    public configure(): void
    {
        /**
         * Updates a vehicle
         * @returns 200 OK.
         */
        this.router.post("/v2/kpi/routes", async context =>
        {
            await context.authorize("view-kpis");

            const body = context.request.body;
            const organizationIds = [context.user?.organizationId];

            if (body.fulfillerId != null)
            {
                organizationIds.push(body.fulfillerI);
            }

            const result = await this.apiClient.post("logistics-platform/kpi/shared",
            {
                noi: true,
                body: {
                    ...body,
                    accessOutfits: [context.user?.organizationId],
                    fulfillerIds: organizationIds
                }
            });

            context.response.body = result.data;
            context.response.status = 200;
        });
    }
}
