import { AppModule } from "../../app-module";
import { v4 as uuidV4 } from "uuid";
import { AppContext } from "app/app-context";
import { DateTime } from "luxon";

/**
 * Represents a module exposing endpoints related to distribution centers.
 */
export class DistributionCenterModule extends AppModule
{
    /**
     * Creates a distribution center
     * @returns The created distribution center.
     */
    public "POST /v2/distribution-centers" = async (context: AppContext) =>
    {
        await context.authorize("create-distribution-centers");

        const body = context.request.body;
        body.ownerId = context.user?.organizationId;
        body.createdBy = context.user?.id;
        body.id = uuidV4();

        await this.apiClient.post("logistics/depots/create",
        {
            body: body
        });

        context.response.body = body;
        context.response.status = 200;
    }

    /**
     * Updates a distribution center
     * @returns 200 OK.
     */
    public "POST /v2/distribution-centers/update" = async (context: AppContext) =>
    {
        await context.authorize("edit-distribution-centers");

        const body = context.request.body;
        body.createdBy = context.user?.id;

        const result = await this.apiClient.post("logistics/depots/update",
        {
            body: body
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Gets the list of distribution centers.
     * @returns The list of distribution centers.
     */
    public "GET /v2/distribution-centers" = async (context: AppContext) =>
    {
        await context.authorize("view-distribution-centers");

        const result = await this.apiClient.post("logistics/depots/list",
        {
            body:
            {
                ownerIds: [context.user?.organizationId]
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Gets the distribution center with the specified ID.
     * @param context.params.id The ID of the distribution center to get.
     * @returns The distribution center with the specified ID.
     */
    public "GET /v2/distribution-centers/:id" = async (context: AppContext) =>
    {
        await context.authorize("view-distribution-centers");

        const result = await this.apiClient.post("logistics/depots/details",
        {
            body:
            {
                id: context.params.id
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Will add a collo to a distribution center
     * @returns The added collo.
     */
    public "POST /v2/distribution-centers/add-collo" = async (context: AppContext) =>
    {
        await context.authorize("view-distribution-centers");

        const body = context.request.body;
        body.createdBy = context.user?.id;

        // FIXME: Add the collo

        await this.apiClient.post("logistics/depots/list",
        {
            body:
            {
                ownerIds: [context.user?.organizationId]
            }
        });

        context.response.body = [];
        context.response.status = 200;
    }

    /**
     * Will get a cache of colli so that the DC app can quickly scan
     * @returns An array of colli for today.
     */
    public "POST /v2/distribution-centers/colli-cache" = async (context: AppContext) =>
    {
        await context.authorize("view-distribution-centers");

        const organizationIds = [context.user?.organizationId];
        const requestBody = context.request.body;
        const locationId = requestBody.distributionCenter.location.locationId;

        const allColliNOIPromise = this.allColliNOI(requestBody.distributionCenter);
        const orderIdsResultPromise = this.apiClient.post("logistics/orders/fulfiller/orderslookup",
        {
            body: {
                outfitIds: organizationIds,
                status: [1, 2, 3],
                pickupLocationIds: [locationId],
                FromDate: DateTime.utc().startOf("day"),
                ToDate: DateTime.utc().plus({ days: 2 }).endOf("day"),
                page: 1,
                pageSize: 1000,
                consignorIds: []
            }
        });

        const [orderIdsResult, allColliNOI] = await Promise.all([orderIdsResultPromise, allColliNOIPromise]);

        const results = allColliNOI;
        const internalIds = orderIdsResult.data.internalOrderIds;

        // If we get any we use this instead of the data from NOI - since more updated
        if (internalIds.length > 0)
        {
            const ordersResult = await this.apiClient.post("logistics/orders/fulfiller/listorders",
            {
                body: {
                    outfitIds: organizationIds,
                    internalOrderIds: internalIds
                }
            });

            for (const order of ordersResult.data)
            {

                // Verify the order does not currently exist in the list
                if (order.actualColli.length > 0 && !results.some(r => r.orderId === order.orderId))
                {
                    for (const collo of order.actualColli)
                    {
                        results.push({
                            barcode: collo.barcode,
                            status: "not-assigned-to-route",
                            orderId: order.orderId
                        });
                    }
                }
            }
        }

        context.response.body = results;
        context.response.status = 200;
    }

    /**
     * Scans a collo on a distribution center
     * @returns The collo object.
     */
    public "POST /v2/distribution-centers/scan-collo" = async (context: AppContext) =>
    {
        await context.authorize("edit-distribution-centers");

        const organizationIds = [context.user?.organizationId];
        const requestBody = context.request.body;

        // Fetch from NOI if possible
        const barcodeResult = await this.apiClient.post("logistics-platform/barcodes/barcode-info",
        {
            body: {
                barcode: requestBody.barcode,
                depotId: requestBody.distributionCenter.id,
                depotPosition: requestBody.distributionCenter.location.position
            },
            noi: true
        });

        let collo = barcodeResult.data;
        collo.status = this.MapNOIBarcodeStatus(collo.status);
        collo.distributionCenter = collo.depot;
        delete collo.depot;

        // If not found we find it through logistics platform
        if (collo.status === "not-found")
        {
            const orderIdsResult = await this.apiClient.post("logistics/orders/fulfiller/orderslookup",
            {
                body: {
                    outfitIds: organizationIds,
                    barcodes: [requestBody.barcode],
                    status: [1, 2, 3],
                    page: 1,
                    pageSize: 1,
                    consignorIds: []
                }
            });

            const internalIds = orderIdsResult.data.internalOrderIds;

            // If we get any we use this instead of the data from NOI - since more updated
            if (internalIds.length > 0)
            {
                const ordersResult = await this.apiClient.post("logistics/orders/fulfiller/listorders",
                {
                    body: {
                        outfitIds: organizationIds,
                        internalOrderIds: internalIds
                    }
                });

                const order = ordersResult.data[0];

                // Find correct status dependent on locationId
                const pickupLocationId = order.pickupLocation.locationId;
                const currentLocationId = requestBody.distributionCenter.location.locationId;
                const status = pickupLocationId === currentLocationId ? "not-assigned-to-route" : "wrong-depot";

                collo =
                {
                    barcode: requestBody.barcode,
                    status: status,
                    orderId: order.orderId,
                    orderPickupLocationId: pickupLocationId
                };
            }
        }

        // We mark the collo as scanned, this will send an event
        if (collo.status === "assigned-to-route" || collo.status === "not-assigned-to-route")
        {
            await this.apiClient.post("logistics/Orders/Events/Fulfiller/ColloArrivedAtDepot",
            {
                body: {
                    outfitIds: organizationIds,
                    barcode: requestBody.barcode,
                    scanningTime: DateTime.local(),
                    scannedBy: context.user?.id,
                    depotId: requestBody.distributionCenter.id
                }
            });
        }

        if (collo.status === "wrong-depot")
        {
            // We could show the incorrect depot in the future
            delete collo.distributionCenter;
        }

        context.response.body = collo;
        context.response.status = 200;
    }

    private MapNOIBarcodeStatus(status: string): string
    {
        if (status === "AssignedToRoute")
        {
            return "assigned-to-route";
        }

        if (status === "NotAssignedToRoute")
        {
            return "not-assigned-to-route";
        }

        if (status === "NotFound")
        {
            return "not-found";
        }

        return "wrong-depot";
    }

    private async allColliNOI(distributionCenter: any): Promise<any[]>
    {
        const result = await this.apiClient.post("logistics-platform/barcodes/barcodes-depot",
        {
            body: {
                fromDate: DateTime.utc(),
                depotId: distributionCenter.id,
                depotPosition: distributionCenter.location.position
            },
            noi: true
        });

        const colli = result.data.results;

        for (const collo of colli)
        {
            collo.status = this.MapNOIBarcodeStatus(collo.status);
        }

        return colli;
    }
}
