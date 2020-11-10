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

            // Always created the order created event, until all data is part of placed
            // NB: The Order Created event has been removed temporarily from the list of events
            // Unshift to always have created event first
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
                }
            );

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
                            .plus({ hours: Number(orderDetailsData.deliveryEarliestTime.substr(0, 2)) })
                            .plus({ minutes: Number(orderDetailsData.deliveryEarliestTime.substr(3, 2)) })
                            .plus({ seconds: Number(orderDetailsData.deliveryEarliestTime.substr(6, 2)) })
                            .toISO(),

                        end: DateTime
                            .fromISO(orderDetailsData.deliveryLatestDate, { setZone: true })
                            .plus({ hours: Number(orderDetailsData.deliveryLatestTime.substr(0, 2)) })
                            .plus({ minutes: Number(orderDetailsData.deliveryLatestTime.substr(3, 2)) })
                            .plus({ seconds: Number(orderDetailsData.deliveryLatestTime.substr(6, 2)) })
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
                        length: c.dimension.lenght, //NB Misspelling from api response model
                        width: c.dimension.width,
                        height: c.dimension.height,
                    },
                    tags: c.tags
                })),
                driver: driverData
                ?
                {
                    id: "unknownAtTheMoment",
                    firstName: driverData?.firstName,
                    pictureUrl: undefined,
                    position: driverPosition
                }
                : null
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
     *
     * @param dateTime is the exact eta time provided in the event
     * @returns a datetime range with start and from
     */
    private getTimeRangeFromEtaEvents(dateTime: DateTime) : any
    {
        const result =
        {
            start: dateTime.minus({minutes: 10}),
            end: dateTime.plus({minutes: 15})
        };

        return result;
    }

    /**
     * Creates a tracking event based on the specified order event data, if supported.
     * @param data The data representing the order event.
     * @returns The tracking event, or null if the order event has no corresponding tracking event.
     */
    private getTrackingEvent(data: any): any | null
    {
        switch (data.eventType)
        {
            case "order-created": return {
                id: data.id,
                type: "order",
                dateTimeRange: { start: data.timeOfEvent, end: data.timeOfEvent },
                title: eventTitles.orderPlaced,
                location: undefined,
                focusOnMap: false,
                hasOccurred: true
            };

            case "order-pickup-completed": return {
                id: data.id,
                type: "pickup",
                dateTimeRange: { start: data.data.timeOfEvent, end: data.data.timeOfEvent },
                title: eventTitles.outForDelivery,
                location:
                {
                    address:
                    {
                        id: data.data.pickupLocation.position.latitude.toString() + data.data.pickupLocation.position.longitude.toString(),
                        primary: data.data.pickupLocation.name
                    },
                    position:
                    {
                        latitude: data.data.pickupLocation.position.latitude,
                        longitude: data.data.pickupLocation.position.longitude
                    }
                },
                focusOnMap: false,
                hasOccurred: true
            };

            case "order-delivery-eta-provided": return {
                id: "estimated-delivery-event-id",
                type: "delivery",
                dateTimeRange: this.getTimeRangeFromEtaEvents(DateTime.fromISO(data.data.deliveryEta)),
                title: eventTitles.deliveryEstimated,
                location:
                {
                    address:
                    {
                        id: data.data.deliveryLocation.position.latitude.toString() + data.data.deliveryLocation.position.longitude.toString(),
                        primary: data.data.deliveryLocation.name
                    },
                    position:
                    {
                        latitude: data.data.deliveryLocation.position.latitude,
                        longitude: data.data.deliveryLocation.position.longitude
                    }
                },
                focusOnMap: true,
                hasOccurred: false
            };

            case "order-delivery-completed": return {
                id: data.id,
                type: "delivery",
                title: eventTitles.deliveryCompleted,
                dateTimeRange: { start: data.data.timeOfEvent, end: data.data.timeOfEvent },
                location:
                {
                    address:
                    {
                        id: data.data.deliveryLocation.position.latitude.toString() + data.data.deliveryLocation.position.longitude.toString(),
                        primary: data.data.deliveryLocation.name
                    },
                    position:
                    {
                        latitude: data.data.deliveryLocation.position.latitude,
                        longitude: data.data.deliveryLocation.position.longitude
                    }
                },
                focusOnMap: true,
                hasOccurred: true
            };

            default: return null;
        }
    }
}
