import { AppContext } from "../../app-context";
import { AppModule } from "../../app-module";
import { FilesModule } from "../files/files";

/**
 * Represents a module exposing endpoints related to route details
 */
export class OrdersModule extends AppModule
{
    /**
     * Gets the vehicles for an organization
     * @returns The a list of vehicle.
     */
    public "POST /v2/orders/list" = async (context: AppContext) =>
    {
        await context.authorize("view-orders");

        const body =
        {
            ...context.request.body,
            organizationIdents: [context.user!.organizationId]
        };

        const orderIdsResult = await this.apiClient.post("logistics/organizations/orders/lookup",
        {
            body: body
        });

        if (orderIdsResult.data.internalOrderIds.length === 0)
        {
            context.response.body = { orders: []};
            context.response.status = 200;

            return;
        }

        const result = await this.apiClient.post(`logistics/organizations/${context.user!.organizationId}/orders/list`,
        {
            body: {
                internalOrderIds: orderIdsResult.data.internalOrderIds
            }
        });

        context.response.body = { orders: result.data };
        context.response.status = 200;
    }

    /**
     * Gets the vehicles for an organization
     * @returns The a list of vehicle.
     */
    public "POST /v2/orders/update-status" = async (context: AppContext) =>
    {
        await context.authorize("edit-orders");

        const body = context.request.body;

        if (body.status === "ready")
        {
            const result = await this.apiClient.post("logistics/orders/MarkOrderReady",
            {
                body: {
                    internalOrderId: body.id,
                    createdBy: context.user?.id
                }
            });

            context.response.body = result.data;
            context.response.status = 200;
        }
        else if (body.status === "cancelled")
        {
            const result = await this.apiClient.post(`logistics/organizations/${context.user!.organizationId}/orders/${body.id}/cancel`,
            {
                body: {
                    cancelledBy: context.user?.id
                }
            });

            context.response.body = result.data;
            context.response.status = 200;
        }
        else
        {
            context.response.status = 404;
        }
    }

    /**
     * Imports the orders represented by the specified file.
     * Note that the form body should be formatted as FormData.
     * @param context.request.body.file The file from which to import orders.
     * @returns The result of the operation.
     */
    public "POST /v2/orders/import-from-file" = async (context: AppContext) =>
    {
        await context.authorize("create-orders");

        const body = await FilesModule.readStream(context.req);

        const result = await this.apiClient.post("import-orders-api/uploadfile",
        {
            headers:
            {
                "content-type": context.request.headers["content-type"],
                "content-length": context.request.headers["content-length"]
            },
            body: body
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Removes the specified order from its current route, executing the specified action.
     * @returns 200 OK
     */
    public "POST /v2/orders/remove-from-route" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        await this.apiClient.post("logistics-platform/routes/v5/remove-order-from-route",
        {
            noi: true,
            body:
            {
                RouteId: context.request.body.routeId,
                OrderOwnerId: context.request.body.consignorId,
                OrderId: context.request.body.orderSlug,
                OrderAction: context.request.body.action,
                ActionBy: context.user!.id
            }
        });

        context.response.status = 200;
    }

    /**
     * Edits an order
     * @returns 200 OK
     */
    public "POST /v2/orders/edit" = async (context: AppContext) =>
    {
        await context.authorize("edit-orders");

        const organizationIds = [context.user?.organizationId];
        const requestBody = context.request.body;

        const body: any =
        {
            outfitIds: organizationIds,
            editedBy: context.user?.id
        };

        const pickup = requestBody.pickup;
        pickup.address = pickup.location.address.secondary == null ? pickup.location.address.primary : `${pickup.location.address.primary}, ${pickup.location.address.secondary}`;
        pickup.instructions = { text: pickup.instructions };

        const delivery = requestBody.delivery;
        delivery.address = delivery.location.address.secondary == null ? delivery.location.address.primary : `${delivery.location.address.primary}, ${delivery.location.address.secondary}`;
        delivery.instructions = { text: delivery.instructions };

        body.order =
        {
            internalOrderId: requestBody.id,
            ownerId: context.user?.organizationId,
            ownerOrderId: requestBody.slug,
            relationalId: requestBody.relationalId,
            departmentId: "",
            pickup: pickup,
            delivery: delivery,
            tags: requestBody.tags,
            requirements: [],
            createdBy: context.user?.id
        };

        const result = await this.apiClient.post("logistics/orders/edit/v2",
        {
            body: body
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Gets the journey for the order
     * @returns The journey.
     */
    public "GET /v2/orders/journey/:id" = async (context: AppContext) =>
    {
        await context.authorize("view-orders");

        try
        {
            const result = await this.apiClient.get("logistics-platform/orders/journey-details",
            {
                query: {
                    orderId: context.params.id
                },
                noi: true
            });

            context.response.body = result.data;
            context.response.status = 200;
        }
        catch (error: any)
        {
            if (error.data?.status === 102)
            {
                context.response.body = { passages: [] };
                context.response.status = 200;
            }
        }
    }

    /**
     * Get a specific order
     * @returns The order.
     */
    public "GET /v2/orders/:id" = async (context: AppContext) =>
    {
        await context.authorize("view-orders");
        const organizationIds = [context.user?.organizationId];

        const body =
        {
            organizationIdents: organizationIds,
            orderIds: [context.params.id],
            page: 1,
            pageSize: 1
        };

        const orderLookupResult = await this.apiClient.post("logistics/organizations/orders/lookup",
        {
            body: body
        });

        if (orderLookupResult.data.internalOrderIds.length <= 0)
        {
            context.response.status = 404;

            return;
        }

        const internalOrderId = orderLookupResult.data.internalOrderIds[0];

        const orderDetailsResult = await this.apiClient.post(`logistics/organizations/${context.user!.organizationId}/orders/${internalOrderId}/details`);

        const order = orderDetailsResult.data[0];

        let pickupPosition;
        let pickupLocationId;
        let deliveryPosition;
        let deliveryLocationId;

        if (order.consignorAddressPosition != null)
        {
            pickupPosition = { latitude: order.consignorAddressPosition.latitude, longitude: order.consignorAddressPosition.longitude };
            pickupLocationId = order.consignorAddressPosition.locationId;
        }

        if (order.consigneeAddressPosition != null)
        {
            deliveryPosition = { latitude: order.consigneeAddressPosition.latitude, longitude: order.consigneeAddressPosition.longitude };
            deliveryLocationId = order.consigneeAddressPosition.locationId;
        }

        const pickup =
        {
            location: { position: pickupPosition, address: { primary: order.consignorAddress }, id: pickupLocationId },
            name: order.consignorPersonName,
            companyName: order.consignorCompanyName,
            phone: order.consignorPhoneNumber,
            email: order.consignorEmail,
            appointment:
            {
                earliestArrivalDate: order.pickupEarliestDate,
                earliestArrivalTime: order.pickupEarliestTime,
                latestArrivalDate: order.pickupLatestDate,
                latestArrivalTime: order.pickupLatestTime
            },
            instructions: order.pickupInstructions,
            estimatedTaskTime: order.pickupEstimatedTaskTime
        };

        const delivery =
        {
            location: { position: deliveryPosition, address: { primary: order.consigneeAddress }, id: deliveryLocationId },
            name: order.consigneePersonName,
            companyName: order.consigneeCompanyName,
            phone: order.consigneePhoneNumber,
            email: order.consigneeEmail,
            appointment:
            {
                earliestArrivalDate: order.deliveryEarliestDate,
                earliestArrivalTime: order.deliveryEarliestTime,
                latestArrivalDate: order.deliveryLatestDate,
                latestArrivalTime: order.deliveryLatestTime,
                estimatedArrivalTime: order.state.isCancelled || order.state.isDeleted ? undefined : await this.fetchEstimatedArrivalTime(order.consignorId, order.orderId)
            },
            instructions: order.deliveryInstructions,
            estimatedTaskTime: order.deliveryEstimatedTaskTime
        };

        context.response.body =
        {
            id: order.internalOrderId,
            slug: order.orderId,
            relationalId: order.relationalId,
            state: order.state,
            pickup: pickup,
            delivery: delivery,
            estimatedColli: this.cleanupColli(order.estimatedColli),
            actualColli: this.cleanupColli(order.actualColli),
            tags: order.tags.map((t: any) => t.tag),
            consignorId: order.consignorId
        };

        context.response.status = 200;
    }

    private cleanupColli(colli: any[]): any[]
    {
        if (colli == null)
        {
            return [];
        }

        const result: any[] = [];

        for (const collo of colli)
        {
            let dimension;
            if (collo.dimension != null)
            {
                dimension = collo.dimension;
            }
            else if (collo.dimensions != null)
            {
                dimension = collo.dimensions;
            }

            if (dimension != null)
            {
                collo.dimensions =
                {
                    width: dimension.width,
                    height: dimension.height,
                    length: dimension.length == null ? dimension.lenght : dimension.length
                };
            }

            delete collo.dimension;
            result.push(collo);
        }

        return result;
    }

    /**
     * Fetches the estimated arrival time for the specified order.
     * @param outfitId The ID of the outfit owning the order.
     * @param orderId The ID of the order.
     * @returns A promise that will be resolved with an ISO 8601 string representing the estimated arrival time, if any.
     */
    private async fetchEstimatedArrivalTime(outfitId: string, orderId: string): Promise<string | undefined>
    {
        // Fetch the `order-delivery-eta-provided` events associated with the order.
        const result = await this.apiClient.post<any[]>("orderevent/GetEvents",
        {
            body:
            {
                eventTypes:
                [
                    "order-delivery-completed",
                    "order-delivery-failed",
                    "order-delivery-eta-provided"
                ],
                ownerId: outfitId,
                ownerOrderId: orderId
            }
        });

        const orderEventsData = result.data!;

        // If no events were found, or the order is already delivered, failed or cancelled, return undefined.
        if (orderEventsData.length === 0 || orderEventsData.some(e => ["order-delivery-completed", "order-delivery-failed"].includes(e.eventType)))
        {
            return undefined;
        }

        // Ensure the events are sorted by descending date.
        orderEventsData.sort((a, b) => b.data.timeOfEvent.valueOf() - a.data.timeOfEvent.valueOf());

        // HACK: The other dates in the order model are local without offset, so to keep things consistent, we remove the offset from this date.
        // Get the estimated arrival time from the most recent event.
        return orderEventsData[0].data.deliveryEta.replace(/(T[^+-]*).*$/, "$1");
    }
}
