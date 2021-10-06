import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to route details
 */
export class OrdersModule extends AppModule
{
    /**
     * Configures the module.
     */
    public configure(): void
    {
        /**
         * Gets the vehicles for an organization
         * @returns The a list of vehicle.
         */
        this.router.post("/v2/orders/list", async context =>
        {
            await context.authorize("view-orders");

            const organizationIds = [context.user?.organizationId];
            const body = context.request.body;
            body.outfitIds = organizationIds;
            body.consignorIds = [];

            const orderIdsResult = await this.apiClient.post("logistics/orders/fulfiller/orderslookup",
            {
                body: body
            });

            const result = await this.apiClient.post("logistics/orders/fulfiller/listorders",
            {
                body: {
                    outfitIds: organizationIds,
                    internalOrderIds: orderIdsResult.data.internalOrderIds
                }
            });

            context.response.body = { orders: result.data };
            context.response.status = 200;
        });

        /**
         * Gets the journey for the order
         * @returns The journey.
         */
        this.router.get("/v2/orders/journey/:id", async context =>
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
        });

        /**
         * Get a specific order
         * @returns The order.
         */
        this.router.get("/v2/orders/:id", async context =>
        {
            await context.authorize("view-orders");
            const organizationIds = [context.user?.organizationId];

            const body =
            {
                orderIds: [context.params.id],
                page: 1,
                pageSize: 1,
                outfitIds: organizationIds,
                fulfillerIds: organizationIds
            };

            const orderIdsResult = await this.apiClient.post("logistics/orders/fulfiller/orderslookup",
            {
                body: body
            });

            if (orderIdsResult.data.internalOrderIds.length <= 0)
            {
                context.response.status = 404;

                return;
            }

            const result = await this.apiClient.post("logistics/orders/fulfiller/detailOrders",
            {
                body: {
                    outfitIds: organizationIds,
                    internalOrderIds: orderIdsResult.data.internalOrderIds
                }
            });

            const order = result.data[0];

            let pickupPosition;
            let pickupLocationId;
            let deliveryPosition;
            let deliveryLocationId;

            if (order.consignorAddressPosition != null)
            {
                pickupPosition = { latitude: order.consignorAddressPosition.latitude, longitude: order.consignorAddressPosition.longitude }
                pickupLocationId = order.consignorAddressPosition.locationId;
            }

            if (order.consigneeAddressPosition != null)
            {
                deliveryPosition = { latitude: order.consigneeAddressPosition.latitude, longitude: order.consigneeAddressPosition.longitude }
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
            }

            const delivery =
            {
                location: { position: deliveryPosition, address: { primary: order.consigneeAddress }, id: deliveryLocationId },
                name: order.consigneePersonName,
                companyName: order.consigneeCompanyName,
                phone: order.consigneePhoneNumber,
                email: order.consigneeEmail,
                appointment: { earliestArrivalDate: order.deliveryEarliestDate, earliestArrivalTime: order.deliveryEarliestTime, latestArrivalDate: order.deliveryLatestDate, latestArrivalTime: order.deliveryLatestTime },
                instructions: order.deliveryInstructions
            }

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
                tags: order.tags,
                consignorId: order.consignorId
            };

            context.response.status = 200;
        });
    }

    private cleanupColli(colli: any[]): any[]
    {
        if (colli == null)
        {
            return [];
        }

        var result: any[] = [];

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
                    length: dimension.length == null ? dimension.lenght : dimension.length,
                };
            }

            delete collo.dimension;
            result.push(collo);
        }

        return result;
    }
}
