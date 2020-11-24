import { DateTime } from "luxon";
import { getStrings } from "../../../shared/localization";
import { environment } from "../../../env";
import { AppModule } from "../../app-module";
import { MapObject } from "shared/types";

/**
 * Represents a module exposing endpoints related to tracking.
 */
export class OrderStatusModule extends AppModule
{
    public configure(): void
    {
        /**
         * Gets the tracking info for the specified tracking ID.
         * @param context.params.id The ID of the order for which to get tracking info.
         * @returns The tracking info for the specified tracking ID.
         */
        this.router.get("/v2/order-status/:id", async context =>
        {
            // tslint:disable-next-line: no-require-imports
            const eventTitles = getStrings("./resources/strings/order-status-event-titles.json");

            const trackingId = context.params.id.toLowerCase();

            context.internal();

            // Fetch the order details.

            let orderDetailsData: any;

            try
            {
                orderDetailsData = await this.fetchOrderDetails(trackingId);
            }
            catch (error: any)
            {
                // The API returns status 422 if the entity is not found, but the client expects status 404.
                if (error.response?.status === 422)
                {
                    // Set the response status.
                    context.response.status = 404;

                    return;
                }

                throw error;
            }

            // Fetch the order events.
            const orderEventsData = await this.fetchOrderEvents(orderDetailsData.consignorId, orderDetailsData.orderId);

            // If the order is already delivered, remove any `order-delivery-eta-provided` event.
            if (orderEventsData.some(e => e.type === "order-delivery-completed"))
            {
                const indexToRemove = orderEventsData.findIndex(e => e.type === "order-delivery-eta-provided");

                if (indexToRemove > -1)
                {
                    orderEventsData.splice(indexToRemove, 1);
                }
            }

            // Map the relevant order events to tracking events.
            const trackingEvents = orderEventsData.map(e => this.getTrackingEvent(e, eventTitles)).filter(e => e != null);

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
                            id: orderDetailsData.consigneeAddressPosition?.locationId,
                            primary: orderDetailsData.consigneeAddress
                        },
                        position: orderDetailsData.consigneeAddressPosition == null ? undefined :
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
                    id: driverData.id,
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
            noi: true,
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
     * @param eventTitles The localized event titles.
     * @returns The tracking event, or null if the order event has no corresponding tracking event.
     */
    private getTrackingEvent(eventData: any, eventTitles: MapObject<string>): any | null
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

            case "order-delivery-failed": return {
                id: eventData.id,
                type: "delivery-failed",
                title: eventTitles.deliveryFailed,
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
