import { AppContext } from "../../../../app-context";
import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to staging.
 */
export class DistributionCenterStagingModule extends AppModule
{
    /**
     * Saves the collo verified event
     * @returns 202 ok
     */
    public "POST /v2/distribution-centers/staging/collo/validated" = async (context: AppContext) =>
    {
        await context.authorize();

        const body = context.request.body;
        await this.addOrderInformation(body);

        const routesResult = await this.apiClient.post("staging/collo/validated",
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
     * Saves the collo damaged event
     * @returns 202 ok
     */
    public "POST /v2/distribution-centers/staging/collo/damaged" = async (context: AppContext) =>
    {
        await context.authorize();

        const body = context.request.body;
        await this.addOrderInformation(body);

        const routesResult = await this.apiClient.post("staging/collo/damaged",
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
     * Saves the collo missing event
     * @returns 202 ok
     */
    public "POST /v2/distribution-centers/staging/collo/missing" = async (context: AppContext) =>
    {
        await context.authorize();

        const body = context.request.body;
        await this.addOrderInformation(body);

        const routesResult = await this.apiClient.post("staging/collo/missing",
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
     * Add information to the order part of the event
     */
    private async addOrderInformation(body: any): Promise<void>
    {

        const orderResult = await this.apiClient.post(`logistics/organizations/${body.order.creatorId}/orders/${body.order.id}/details`);

        const order = orderResult.data[0];
        const tags: any[] = order.tags;

        body.order.relationalId = order.relationalId;
        body.order.tags = tags.map(t => t.tag);
    }
}
