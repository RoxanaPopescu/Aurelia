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
            const orderEventsData = await this.fetchOrderEvents(orderDetailsData.consignorId, orderDetailsData.orderId);

            // Map the relevant order events to tracking events.
            const trackingEvents = orderEventsData.map(e => this.getTrackingEvent(e)).filter(e => e != null);

            // Always create the `order` tracking event based on the order details,
            // as `order-placed` order event does not include all the data we need.
            trackingEvents.unshift(
            {
                id: "order-created-event-id",
                type: "order",
                dateTimeRange:
                {
                    start: DateTime.fromISO(orderDetailsData.createdAt),
                    end: DateTime.fromISO(orderDetailsData.createdAt)
                },
                title: eventTitles.orderPlaced,
                location: undefined,
                focusOnMap: false,
                hasOccurred: true
            });

            // If no `delivery` event exists, create one based on the planned delivery time.
            if (!trackingEvents.some(e => e.type === "delivery"))
            {
                trackingEvents.push(
                {
                    id: "planned-delivery-event-id",
                    type: "delivery",
                    dateTimeRange:
                    {
                        start: this.getDateTimeString(orderDetailsData.deliveryEarliestDate, orderDetailsData.deliveryEarliestTime),
                        end: this.getDateTimeString(orderDetailsData.deliveryLatestDate, orderDetailsData.deliveryLatestTime)
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

            //Remove delivery eta event if order is completed
            const hasDeliveryCompletedEvent = trackingEvents.some(e => e.type === "delivery" && e.hasOccurred);
            const hasDeliveryEtaEvent = trackingEvents.some(e => e.type === "delivery" && !e.hasOccurred);
            if (hasDeliveryCompletedEvent && hasDeliveryEtaEvent)
            {
                const indexOfEventToBeRemoved = trackingEvents.findIndex(e => e.type === "delivery" && !e.hasOccurred);

                if (indexOfEventToBeRemoved > -1)
                {
                    trackingEvents.splice(indexOfEventToBeRemoved, 1);
                }
            }

            // Get the data for the driver associated with the estimated delivery.
            const driverData = orderEventsData.find(e => e.type === "order-delivery-eta-provided")?.driver;

            // Get the last known position of the driver, if any.
            const driverPosition = driverData?.id ? await this.fetchDriverPosition(driverData.id) : undefined;

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
                    dimensions:
                    {
                        // HACK: Misspelling is intentional, to match the property name in the data.
                        length: c.dimension.lenght,
                        width: c.dimension.width,
                        height: c.dimension.height
                    },
                    tags: c.tags
                })),

                driver: driverData == null ? undefined :
                {
                    id: "driver-id",
                    firstName: driverData?.firstName,
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
        const result = await this.apiClient.post<any[]>("logistics/orders/consignor/DetailOrders",
        {
            body:
            {
                internalOrderIds: [orderId],

                // HACK: Because we do not yet have proper support for getting the access outfits associated with the current identity.
                outfitIds: environment.name === "production"
                    ? ["F1003E94-D520-4D0C-959A-AFB76BDC91F3"]
                    : ["5D6DB3D4-7E69-4939-8014-D028A5EB47FF"]
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
        const result = await this.apiClient.post<any[]>("orderevent/GetEvents",
        {
            body:
            {
                eventTypes:
                [
                    "order-pickup-completed",
                    "order-delivery-completed",
                    "order-delivery-eta-provided"
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
        const result = await this.apiClient.post("/logistics/drivers/last-cooordinate",
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
     * @param eventData The data representing the order event.
     * @returns The tracking event, or null if the order event has no corresponding tracking event.
     */
    private getTrackingEvent(eventData: any): any | null
    {
        switch (eventData.eventType)
        {
            case "order-created": return {
                id: eventData.id,
                type: "order",
                dateTimeRange: { start: eventData.data.timeOfEvent, end: eventData.data.timeOfEvent },
                title: eventTitles.orderPlaced,
                location: undefined,
                focusOnMap: false,
                hasOccurred: true
            };

            case "order-pickup-completed": return {
                id: eventData.id,
                type: "pickup",
                dateTimeRange: { start: eventData.data.timeOfEvent, end: eventData.data.timeOfEvent },
                title: eventTitles.outForDelivery,
                location: this.getLocation(eventData.data.pickupLocation),
                focusOnMap: false,
                hasOccurred: true
            };

            case "order-delivery-eta-provided": return {
                id: "estimated-delivery-event-id",
                type: "delivery",
                dateTimeRange: this.getPaddedEta(DateTime.fromISO(eventData.data.deliveryEta)),
                title: eventTitles.deliveryEstimated,
                location: this.getLocation(eventData.data.deliveryLocation),
                focusOnMap: true,
                hasOccurred: false
            };

            case "order-delivery-completed": return {
                id: eventData.id,
                type: "delivery",
                title: eventTitles.deliveryCompleted,
                dateTimeRange: { start: eventData.data.timeOfEvent, end: eventData.data.timeOfEvent },
                location: this.getLocation(eventData.data.deliveryLocation),
                focusOnMap: true,
                hasOccurred: true
            };

            default: return null;
        }
    }

    /**
     * Gets the date-time string representing the specified date and time.
     * @param isoDateString The date string.
     * @param isoTimeString The time string.
     * @returns The date-time string representing the specified date and time.
     */
    private getDateTimeString(isoDateString: string, isoTimeString: string): string
    {
        return DateTime
            .fromISO(isoDateString, { setZone: true })
            .plus({ hours: parseInt(isoTimeString.substr(0, 2)) })
            .plus({ minutes: parseInt(isoTimeString.substr(3, 2)) })
            .plus({ seconds: parseInt(isoTimeString.substr(6, 2)) })
            .toISO();
    }

    /**
     * Gets the `Location` model based on the location specified in an order event.
     * @param locationData The data representing the location specified in an order event.
     * @returns The specified location, represented as a `Location` model.
     */
    private getLocation(locationData: any): any
    {
        return {
            address:
            {
                primary: locationData.name
            },
            position:
            {
                latitude: locationData.position.latitude,
                longitude: locationData.position.longitude
            }
        };
    }

    /**
     * Gets the `DateTimeRange` to use as the estimated time of delivery, based on
     * the `DateTime` representing the estimated time of arrival at the location.
     * Note that the range will narrow as the estimate approaches the current time.
     * @param dateTime The estimated time of arrival at the location
     * @returns The time range to show as the estimated time of delivery
     */
    private getPaddedEta(dateTime: DateTime): any
    {
        // The threshold in minutes for when narrowing of the estimate should begin.
        const thresholdForNarrowing = 25;

        const timeUntilEta = Math.max(0, dateTime.diffNow().as("minutes"));
        const scaleFactor = Math.min(1, timeUntilEta / thresholdForNarrowing);

        const result =
        {
            start: dateTime.minus({ minutes: Math.round(scaleFactor * 8) + 2 }),
            end: dateTime.plus({ minutes: Math.round(scaleFactor * 13) + 2 })
        };

        return result;
    }
}
