import { DateTime } from "luxon";
import { getStrings } from "../../../shared/localization";
import { environment } from "../../../env";
import { AppContext } from "../../app-context";
import { AppModule } from "../../app-module";
import { MapObject } from "shared/types";

/**
 * Represents a module exposing endpoints related to order tracking.
 */
export class OrderStatusModule extends AppModule
{
    /**
     * Gets the order tracking settings for the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @returns
     * - 200: An object representing the order tracking settings.
     */
    public "GET /v2/order-tracking/organizations/:organizationId/settings" = async (context: AppContext) =>
    {
        await context.authorize("view-organizations", { organization: context.params.organizationId });

        const result = await this.apiClient.get(`order-tracking/settings/${context.params.organizationId}`);

        context.response.body = result.data.organization;
        context.response.status = 200;
    }

    /**
     * Updates the order tracking settings for the specified organization.
     * @param context.params.organizationId The ID of the organization.
     * @param context.request.body The updated order tracking settings.
     * @returns
     * - 200: An object representing the updated order tracking settings.
     */
    public "POST /v2/order-tracking/organizations/:organizationId/settings/update" = async (context: AppContext) =>
    {
        await context.authorize("edit-organizations", { organization: context.params.organizationId });

        const result = await this.apiClient.post(`order-tracking/organizations/${context.params.organizationId}/settings/update`,
        {
            body: context.request.body
        });

        context.response.body = result.data.organization;
        context.response.status = 200;
    }

    /**
     * Gets the tracking info for the specified order.
     * @param context.params.id The ID of the order for which to get tracking info.
     * @returns An object the tracking info for the specified order.
     */
    public "GET /v2/order-tracking/orders/:id" = async (context: AppContext) =>
    {
        const eventTitles = getStrings("./resources/strings/order-status-event-titles.json");

        const trackingId = context.params.id.toLowerCase();

        context.internal();

        // Fetch the order details.

        let orderDetailsData: any;

        try
        {
            orderDetailsData = await this.fetchOrderDetails(trackingId);

            // Was the order found?
            if (orderDetailsData == null)
            {
                // Set the response status.
                context.response.status = 404;

                return;
            }
        }
        catch (error: any)
        {
            // The API returns status 422 if a malformed ID is specified - we handle that as not found.
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

        // If the order is already delivered, failed or cancelled, remove any `order-delivery-eta-provided` event.
        if (orderEventsData.some(e => ["order-delivery-completed", "order-delivery-failed", "order-cancelled"].includes(e.eventType)))
        {
            const indexToRemove = orderEventsData.findIndex(e => e.eventType === "order-delivery-eta-provided");

            if (indexToRemove > -1)
            {
                orderEventsData.splice(indexToRemove, 1);
            }
        }

        // Map the relevant order events to tracking events.
        const isPickedUp = orderEventsData.some(e => e.eventType === "order-pickup-completed");
        const trackingEvents = orderEventsData.map(e => this.getTrackingEvent(e, eventTitles, isPickedUp)).filter(e => e != null);

        // Always create the `order` tracking event based on the order details,
        // as `order-placed` order event does not include all the data we need.
        trackingEvents.unshift(
        {
            id: "order-created-event-id",
            type: "order",
            dateTimeRange:
            {
                start: DateTime.fromISO(orderDetailsData.createdAt, { setZone: true }),
                end: DateTime.fromISO(orderDetailsData.createdAt, { setZone: true })
            },
            title: eventTitles.orderPlaced,
            location: undefined,
            focusOnMap: false,
            hasOccurred: true
        });

        // If the order is cancelled, create an `order-cancelled` event.
        if (orderDetailsData.state.isCancelled)
        {
            trackingEvents.push(
            {
                id: "order-cancelled-event-id",
                type: "order-cancelled",
                dateTimeRange:
                {
                    start: undefined,
                    end: undefined
                },
                title: eventTitles.orderCancelled,
                location: undefined,
                focusOnMap: false,
                hasOccurred: true
            });
        }

        // If no `delivery` event exists, create one based on the planned delivery time.
        else if (!trackingEvents.some(e => e.type === "delivery"))
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
        const driverData = orderEventsData.find(e => e.eventType === "order-delivery-eta-provided")?.data.driver;

        // Get the last known position of the driver, if any.

        let driverPosition: any;

        try
        {
            if (driverData?.id)
            {
                driverPosition = await this.fetchDriverPosition(driverData.id);
            }
        }
        catch (error)
        {
            console.error(error);
        }

        // Set the response body.
        context.response.body =
        {
            trackingId: trackingId,
            ownerId: orderDetailsData.consignorId,
            ownerOrderId: orderDetailsData.orderId,
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
            driver: driverData?.id == null || driverPosition == null ? undefined :
            {
                id: driverData.id,
                firstName: driverData.firstName,
                pictureUrl: undefined,
                position: driverPosition
            },
            options:
            {
                authorityToLeave: orderDetailsData.authorityToLeave == null ? undefined :
                {
                    instructions: orderDetailsData.authorityToLeave.deliveryInstructions
                }
            }

        };

        // Set the response status.
        context.response.status = 200;
    }

    /**
     * Fetches the details for the specified order.
     * @param orderId The ID of the order.
     * @returns A promise that will be resolved with the order details.
     */
    private async fetchOrderDetails(orderId: string): Promise<any>
    {
        // TODO: Update this to use the new endpoint.
        const result = await this.apiClient.post<any[]>("logistics/orders/consignor/DetailOrders",
        {
            body:
            {
                internalOrderIds: [orderId],

                // HACK: Because we still don't have a dedicated tracking ID, as originally planned.
                outfitIds: environment.name === "production"
                    ? ["F1003E94-D520-4D0C-959A-AFB76BDC91F3", "78f39900-008f-49bc-b379-369726564346", "22A30D79-0CC8-4D9F-9530-C15016EA40D9", "bae22aaa-a95f-4f0a-b565-877e1bb7c861"]
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
                    "order-delivery-failed",
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
        const result = await this.apiClient.post("/logistics-platform/drivers/last-coordinate",
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
     * @param isPickedUp True if the order has been picked up, otherwise false.
     * @returns The tracking event, or null if the order event has no corresponding tracking event.
     */
    private getTrackingEvent(eventData: any, eventTitles: MapObject<string>, isPickedUp: boolean): any | null
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
                dateTimeRange: isPickedUp
                    ? this.getPaddedEta(DateTime.fromISO(eventData.data.deliveryEta, { setZone: true }))
                    : {
                        start: DateTime.fromISO(eventData.data.deliveryTimeFrame.from, { setZone: true }),
                        end: DateTime.fromISO(eventData.data.deliveryTimeFrame.to, { setZone: true })
                    },
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
        // Legacy version - #todo: Remove when we stop supporting v1 events
        if (locationData == null)
        {
            return null;
        }

        if (locationData.name != null)
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

        return locationData;
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
        const thresholdForNarrowing = 120;

        // The max and min padding to use for the start time.
        const paddingStartMax = 20;
        const paddingStartMin = 2;

        // The max and min padding to use for the end time.
        const paddingEndMax = 60;
        const paddingEndMin = 2;

        const timeUntilEta = Math.max(0, dateTime.diffNow().as("minutes"));
        const scaleFactor = Math.min(1, timeUntilEta / thresholdForNarrowing);

        const result =
        {
            start: dateTime.minus({ minutes: Math.round(scaleFactor * (paddingStartMax - paddingStartMin)) + paddingStartMin }),
            end: dateTime.plus({ minutes: Math.round(scaleFactor * (paddingEndMax - paddingEndMin)) + paddingEndMin })
        };

        return result;
    }
}