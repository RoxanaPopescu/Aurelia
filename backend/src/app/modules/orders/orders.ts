import { AppContext } from "../../app-context";
import { AppModule } from "../../app-module";

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
            organizationIdents: [context.user!.organizationId],
        };

        const orderIdsResult = await this.apiClient.post(`logistics/organizations/orders/lookup`,
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
            const result = await this.apiClient.post(`logistics/organizations/${context.user?.organizationId}/orders/${body.id}/cancel`,
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

        const orderIdsResult = await this.apiClient.post(`logistics/organizations/orders/lookup`,
        {
            body: body
        });

        if (orderIdsResult.data.internalOrderIds.length <= 0)
        {
            context.response.status = 404;

            return;
        }

        const internalOrderId = orderIdsResult.data.internalOrderIds[0];

        const result = await this.apiClient.post(`logistics/organizations/${context.user!.organizationId}/orders/${internalOrderId}/details`);

        const order = result.data[0];

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
            appointment: { earliestArrivalDate: order.pickupEarliestDate, earliestArrivalTime: order.pickupEarliestTime, latestArrivalDate: order.pickupLatestDate, latestArrivalTime: order.pickupLatestTime },
            instructions: order.pickupInstructions
        };

        const delivery =
        {
            location: { position: deliveryPosition, address: { primary: order.consigneeAddress }, id: deliveryLocationId },
            name: order.consigneePersonName,
            companyName: order.consigneeCompanyName,
            phone: order.consigneePhoneNumber,
            email: order.consigneeEmail,
            appointment: { earliestArrivalDate: order.deliveryEarliestDate, earliestArrivalTime: order.deliveryEarliestTime, latestArrivalDate: order.deliveryLatestDate, latestArrivalTime: order.deliveryLatestTime },
            instructions: order.deliveryInstructions
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
}
