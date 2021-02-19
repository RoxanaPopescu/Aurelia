import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to order events.
 */
export class OrderEventsModule extends AppModule
{
    public configure(): void
    {
        /**
         * Gets the order events for the specified order.
         * @param context.request.body.consignorId The ID of the consignor owner of the order.
         * @param context.request.body.orderId The ID of the order for which to get events.
         * @returns The order events for the specified order.
         */
        this.router.post("/v2/orders/events", async context =>
        {
            // Fetch the order events.
            const result = await this.apiClient.post("orderevent/GetEventsV2",
            {
                body:
                {
                    ownerId: context.request.body.consignorId,
                    ownerOrderId: context.request.body.orderId
                }
            });

            // Set the response body.
            context.response.body = result.data;

            // Set the response status.
            context.response.status = 200;
        });
    }
}
