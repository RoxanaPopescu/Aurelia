import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to staging.
 */
export class DistributionCenterStagingModule extends AppModule
{
    /**
     * Configures the module.
     */
    public configure(): void
    {
        /**
         * Saves the collo verified event
         * @returns 202 ok
         */
        this.router.post("/v2/distribution-center/staging/collo/validated", async context =>
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
        });

        /**
         * Saves the collo damaged event
         * @returns 202 ok
         */
        this.router.post("/v2/distribution-center/staging/collo/damaged", async context =>
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
        });

        /**
         * Saves the collo missing event
         * @returns 202 ok
         */
        this.router.post("/v2/distribution-center/staging/collo/missing", async context =>
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
        });
    }

    /**
     * Add information to the order part of the event
     */
    private async addOrderInformation(body: any): Promise<void>
    {

        const orderResult = await this.apiClient.post("logistics/orders/consignor/detailOrders",
        {
            body:
            {
                "outfitIds": [ body.order.creatorId ],
                "internalOrderIds": [ body.order.id ]
            }
        });

        const order = orderResult.data[0];
        const tags: any[] = order.tags;

        body.order.relationalId = order.relationalId;
        body.order.tags = tags.map(t => t.tag);
    }
}
