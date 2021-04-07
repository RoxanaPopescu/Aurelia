import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to order events.
 */
export class OrdersEventsModule extends AppModule
{
    public configure(): void
    {
        /**
         * Gets the order events for the specified order.
         * @param context.request.body.ownerId The ID of the owner of the order.
         * @param context.request.body.ownerOrderId The ID of the order for which to get events.
         * @returns The order events for the specified order.
         */
        this.router.post("/v2/orders/events", async context =>
        {
            // Fetch the order events.
            const result = await this.apiClient.post("orderevent/v2/getevents",
            {
                body:
                {
                    eventQueryFilter:
                    [
                        {
                            eventType: "order-pickup-arrived",
                            version: "2.0"
                        },
                        {
                            eventType: "order-delivery-completed",
                            version: "2.0"
                        },
                        {
                            eventType: "order-delivery-arrived",
                            version: "2.0"
                        },
                        {
                            eventType: "order-delivery-failed",
                            version: "2.0"
                        },
                        {
                            eventType: "order-pickup-completed",
                            version: "2.0"
                        },
                        {
                            eventType: "order-pickup-failed",
                            version: "2.0"
                        },
                        {
                            eventType: "order-added-to-route",
                            version: "2.0"
                        },
                        {
                            eventType: "collection-point-collo-damaged",
                            version: "1.0"
                        },
                        {
                            eventType: "collection-point-collo-collected",
                            version: "1.0"
                        },
                        {
                            eventType: "collection-point-collo-missing",
                            version: "1.0"
                        },
                        {
                            eventType: "collection-point-collo-not-collected",
                            version: "1.0"
                        },
                        {
                            eventType: "collection-point-collo-missing",
                            version: "1.0"
                        },
                        {
                            eventType: "staging-collo-validated",
                            version: "1.0"
                        },
                        {
                            eventType: "staging-collo-damaged",
                            version: "1.0"
                        },
                        {
                            eventType: "staging-collo-missing",
                            version: "1.0"
                        },
                        {
                            eventType: "authority-to-leave-granted",
                            version: "1.0"
                        },
                        {
                            eventType: "authority-to-leave-revoked",
                            version: "1.0"
                        }
                    ],
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
