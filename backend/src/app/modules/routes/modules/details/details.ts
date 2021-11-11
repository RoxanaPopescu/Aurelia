import { AppContext } from "../../../../app-context";
import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to route details
 */
export class RoutesListModule extends AppModule
{
    /**
     * Get the route details
     * @returns route details
     */
    public "GET /v2/routes/details" = async (context: AppContext) =>
    {
        await context.authorize("view-routes");

        const body: any =
        {
            slug: context.query.slug,
            currentOutfit: context.user?.organizationId,
            fulfillerIds: [context.user?.organizationId]
        };

        const result = await this.apiClient.post("logistics-platform/routes/v4/details",
        {
            noi: true,
            body: body
        });

        const data = result.data;

        const organizatonId = data.fulfillerId ?? data.fulfiller.id;
        const fulfillerResult = await this.apiClient.post("logistics/outfits/fulfiller/list",
        {
            body: {
                ids: [organizatonId]
            }
        });
        const fulfillers = fulfillerResult.data.results;

        if (fulfillers.length > 0)
        {
            data.fulfiller = fulfillers[0];
        }

        context.response.ctx.set("cache-control", "private,max-age=4");
        context.response.body = data;
        context.response.status = 200;
    }
}
