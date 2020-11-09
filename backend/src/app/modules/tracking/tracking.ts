import { DateTime } from "luxon";
import { AppModule } from "../../app-module";
import eventTitles from "./resources/strings/tracking-event-titles.json";

/**
 * Represents a module exposing endpoints related to tracking.
 */
export class TrackingModule extends AppModule
{
    public configure(): void
    {
        /**
         * Gets the tracking info for the specified tracking ID.
         * @param context.params.id The ID of the tracking info to get.
         * @returns The tracking info for the specified tracking ID.
         */
        this.router.get("/v2/tracking/:id", async context =>
        {
            const trackingId = context.params.id.toUpperCase();
            const trackingIdComponents = trackingId.split("-");

            // Fetch the order details and events.
            const [orderDetails, orderEvents] = await Promise.all(
            [
                // TODO: This won't work. We need a proper way to get the ID of the order, owner and access outfit based on a tracking ID.
                await this.fetchOrderDetails(trackingIdComponents[0], trackingIdComponents[1]),
                await this.fetchOrderEvents(trackingIdComponents[0], trackingIdComponents[1])
            ]);

            context.internal();

            // Map the relevant order events to tracking events.
            const trackingEvents = orderEvents.map(e => this.getTrackingEvent(e)).filter(e => e != null);

            // If no `delivery` event exists, create one based on the planned delivery time.
            if (!trackingEvents.some(e => e.type === "delivery"))
            {
                const a = orderEvents.find(e => e.type === "OrderCreated")?.delivery.appointment;

                trackingEvents.push(
                {
                    id: "delivery-event-id",
                    type: "delivery",
                    dateTimeRange:
                    {
                        start: DateTime.fromISO(a.earliestArrivalDate, { setZone: true }).plus({ seconds: a.earliestArrivalTime }).toISO(),
                        end: DateTime.fromISO(a.latestArrivalDate, { setZone: true }).plus({ seconds: a.latestArrivalTime }).toISO()
                    },
                    title: eventTitles.deliveryEstimated,
                    location: undefined, // TODO: Don't know how to get this
                    focusOnMap: true,
                    hasOccurred: false
                });
            }

            // Get the data for the driver associated with the estimated delivery.
            const driverData = orderEvents.find(e => e.type === "OrderDeliveryEtaProvided")?.driver;

            // Set the response body.
            context.response.body =
            {
                trackingId: trackingId,
                events: trackingEvents,
                colli: orderDetails.actualColli?.map((c: any) =>
                ({
                    id: c.internalId,
                    barcode: c.barcode,
                    weight: c.weight,
                    dimensions: c.dimension,
                    tags: c.tags
                })),
                driver:
                {
                    id: "driver-id",
                    firstName: driverData.firstName,
                    pictureUrl: undefined,
                    position: undefined // TODO: Don't know how to get this
                }
            };

            // Set the response status.
            context.response.status = 200;
        });
    }

    /**
     * Fetches the details for the specified order.
     * @param outfitId The ID of the outfit owning the order.
     * @param orderId The ID of the order.
     * @returns A promise that will be resolved with the order details.
     */
    private async fetchOrderDetails(outfitId: string, orderId: string): Promise<any>
    {
        // Fetch the order details.
        const result = await this.apiClient.get<any[]>("/logistics/orders/consignor/detailOrders",
        {
            body:
            {
                internalOrderIds: [orderId],
                outfitIds: [outfitId]
            }
        });

        return result.data![0];
    }

    /**
     * Fetches the events for the specified order.
     * @param outfitId The ID of the outfit owning the order.
     * @param orderId The ID of the order.
     * @returns A promise that will be resolved with the order events.
     */
    private async fetchOrderEvents(outfitId: string, orderId: string): Promise<any[]>
    {
        const result = await this.apiClient.get<any[]>("getevents",
        {
            body:
            {
                eventTypes:
                [
                    "OrderCreated",
                    "OrderPickupCompleted",
                    "OrderDeliveryCompleted",
                    "OrderDeliveryEtaProvided"
                ],
                ownerId: outfitId,
                ownerOrderId: orderId
            }
        });

        return result.data!;
    }

    /**
     * Creates a tracking event based on the specified order event data, if supported.
     * @param data The data representing the order event.
     * @returns The tracking event, or null if the order event has no corresponding tracking event.
     */
    private getTrackingEvent(data: any): any | null
    {
        switch (data.type)
        {
            case "OrderCreated": return {
                id: data.id,
                type: "order",
                dateTimeRange: { start: data.timeOfEvent, end: data.timeOfEvent },
                title: eventTitles.orderPlaced,
                location: undefined,
                focusOnMap: false,
                hasOccurred: true
            };

            case "OrderPickupCompleted": return {
                id: data.id,
                type: "pickup",
                dateTimeRange: { start: data.timeOfEvent, end: data.timeOfEvent },
                title: eventTitles.outForDelivery,
                location: data.pickupLocation,
                focusOnMap: false,
                hasOccurred: true
            };

            case "OrderDeliveryCompleted": return {
                id: data.id,
                type: "delivery",
                dateTimeRange: { start: data.timeOfEvent, end: data.timeOfEvent },
                title: eventTitles.deliveryCompleted,
                location: data.deliveryLocation,
                focusOnMap: true,
                hasOccurred: true
            };

            case "OrderDeliveryEtaProvided": return {
                id: "estimated-delivery",
                type: "delivery",
                dateTimeRange: { start: data.deliveryTimeFrame.from, end: data.deliveryTimeFrame.to },
                title: eventTitles.deliveryEstimated,
                location: data.deliveryLocation,
                focusOnMap: true,
                hasOccurred: false
            };

            default: return null;
        }
    }
}
