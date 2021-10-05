import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to route details
 */
export class OrdersModule extends AppModule
{
    /**
     * Configures the module.
     */
    public configure(): void
    {
        /**
         * Gets the vehicles for an organization
         * @returns The a list of vehicle.
         */
        this.router.post("/v2/orders/list", async context =>
        {
            await context.authorize("view-orders");

            const organizationIds = [context.user?.organizationId];
            const body = context.request.body;
            body.outfitIds = organizationIds;
            body.consignorIds = [];

            const orderIdsResult = await this.apiClient.post("logistics/orders/fulfiller/orderslookup",
            {
                body: body
            });

            const result = await this.apiClient.post("logistics/orders/fulfiller/listorders",
            {
                body: {
                    outfitIds: organizationIds,
                    internalOrderIds: orderIdsResult.data.internalOrderIds
                }
            });

            context.response.body = { orders: result.data, totalCount:  orderIdsResult.data.totalCount };
            context.response.status = 200;
        });
    }
}
