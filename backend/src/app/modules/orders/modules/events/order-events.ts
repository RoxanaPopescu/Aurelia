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
         * @param context.params.orderId The ID of the order for which to get events.
         * @returns The order events for the specified order.
         */
        this.router.get("/v2/orders/events/:orderId", async context =>
        {
            // Fetch the order events.
            const result = await this.apiClient.post("orderevent/GetEventsV2",
            {
                body:
                {
                    ownerId: context.params.orderId
                }
            });

            // Set the response body.
            context.response.body = result.data;

            // Set the response status.
            context.response.status = 200;
        });
    }
}
