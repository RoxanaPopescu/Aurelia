import { DateTime } from "luxon";
import { environment } from "../../../env";
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
         * @param context.params.id The ID of the order for which to get tracking info.
         * @returns The tracking info for the specified tracking ID.
         */
        this.router.get("/v2/tracking/:id", async context =>
        {
            const trackingId = context.params.id.toLowerCase();

            // Fetch the order details.
            const orderDetailsData = await this.fetchOrderDetails(trackingId);

            context.internal();

            // Fetch the order events.
            const orderEventsData = await this.fetchOrderEvents(orderDetailsData.consignorId, orderDetailsData.internalOrderId);

            // Map the relevant order events to tracking events.
            const trackingEvents = orderEventsData.map(e => this.getTrackingEvent(e)).filter(e => e != null);

            // If no `delivery` event exists, create one based on the planned delivery time.
            if (!trackingEvents.some(e => e.type === "delivery"))
            {
                trackingEvents.push(
                {
                    id: "planned-delivery-event-id",
                    type: "delivery",
                    dateTimeRange:
                    {
                        start: DateTime
                            .fromISO(orderDetailsData.deliveryEarliestDate, { setZone: true })
                            .plus({ seconds: orderDetailsData.deliveryEarliestTime })
                            .toISO(),

                        end: DateTime
                            .fromISO(orderDetailsData.deliveryLatestDate, { setZone: true })
                            .plus({ seconds: orderDetailsData.deliveryLatestTime })
                            .toISO()
                    },
                    title: eventTitles.deliveryEstimated,
                    location:
                    {
                        address:
                        {
                            id: orderDetailsData.consigneeAddressPosition.locationId,
                            primary: orderDetailsData.consigneeAddress
                        },
                        position:
                        {
                            latitude: orderDetailsData.consigneeAddressPosition.latitude,
                            longitude: orderDetailsData.consigneeAddressPosition.longitude
                        }
                    },
                    focusOnMap: true,
                    hasOccurred: false
                });
            }

            // Get the data for the driver associated with the estimated delivery.
            const driverData = orderEventsData.find(e => e.type === "OrderDeliveryEtaProvided")?.driver;

            // Get the last known position of the driver, if any.
            const driverPosition = driverData.id ? await this.fetchDriverPosition(driverData.id) : undefined;

            // Set the response body.
            context.response.body =
            {
                trackingId: trackingId,
                events: trackingEvents,
                colli: orderDetailsData.actualColli?.map((c: any) =>
                ({
                    id: c.internalId,
                    barcode: c.barcode,
                    weight: c.weight,
                    dimensions: c.dimension,
                    tags: c.tags
                })),
                driver:
                {
                    id: driverData.id,
                    firstName: driverData.firstName,
                    pictureUrl: undefined,
                    position: driverPosition
                }
            };

            // Set the response status.
            context.response.status = 200;
        });
    }

    /**
     * Fetches the details for the specified order.
     * @param orderId The ID of the order.
     * @returns A promise that will be resolved with the order details.
     */
    private async fetchOrderDetails(orderId: string): Promise<any>
    {
        // Fetch the order details.
        const result = await this.apiClient.get<any[]>("/logistics/orders/consignor/detailOrders",
        {
            body:
            {
                internalOrderIds: [orderId],

                // HACK: Because we do not yet have proper support for getting the access outfits associated with the current identity.
                outfitIds: environment.name === "production"
                    ? "F1003E94-D520-4D0C-959A-AFB76BDC91F3"
                    : "5D6DB3D4-7E69-4939-8014-D028A5EB47FF"
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
        const result = await this.apiClient.get<any[]>("/logistics/getevents",
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
     * Fetches the last known position of the specified driver.
     * @param driverId The ID of the driver.
     * @returns A promise that will be resolved with the last known position of the driver
     */
    private async fetchDriverPosition(driverId: string): Promise<any>
    {
        const result = await this.apiClient.get("/logistics/drivers/last-cooordinate",
        {
            body:
            {
                driverId: driverId
            }
        });

        return result.data;
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
                id: "estimated-delivery-event-id",
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
