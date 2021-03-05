import { DateTime, Duration } from "luxon";
import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to creating routes.
 */
export class RouteOrdersModule extends AppModule
{
    public configure(): void
    {
        /**
         * Fetches orders that are then combined with the request and sent to NOI
         * @returns 200 OK if added.
         */
        this.router.post("/v2/routes/orders/add", async context =>
        {
            context.authorize("edit-routes");

            const body = context.request.body;

            // Fetch order details
            const ordersResult = await this.apiClient.post("logistics/orders/system/detailOrders",
            {
                body:
                {
                    "internalOrderIds": body.orderIds
                }
            });

            // Mapping
            let orders: any[] = [];

            for (const order of ordersResult.data)
            {
                let orderObject: any = {
                    "id": order.internalOrderId,
                    "creatorOrderId": order.orderId,
                    "creatorId": order.consignorId,
                    "relationalid": order.relationalid,
                    "tags": order.tags,
                    "estimatedColliCount": (order.estimatedColli ?? []).length,
                };

                // TODO: Backend should really fix their spelling mistake with lenght...
                const colli = order.actualColli.map((c: any) => {
                    return {
                        "id": c.internalId,
                        "barcode": c.barcode,
                        "tags": [],
                        "weight": c.weight,
                        "dimension": c.dimensions == null ? undefined : {
                            "width": c.dimensions.width,
                            "length": c.dimensions.length ?? c.dimensions.lenght,
                            "height": c.dimensions.height
                        }
                    }
                });

                const pickup = {
                    "contact": {
                        "preferredName": order.consignorPersonName,
                        "fullName": order.consignorPersonName,
                        "phone": order.consignorPhoneNumber == null ? undefined : {
                            "nationalNumber": order.consignorPhoneNumber,
                            "countryCallingCode": "45",
                            "countryCode": "DK"
                        },
                        "email": order.consignorEmail,
                        "companyName": order.consignorCompanyName,
                    },
                    "location":{
                        "address": {
                            "primary": order.consignorAddress
                        },
                        "position": order.consignorAddressPosition,
                        "timeZone": "Europe/Copenhagen"
                    },
                    "appointment":{
                        "from": this.combine(order.pickupEarliestDate, order.pickupEarliestTime),
                        "to": this.combine(order.pickupLatestDate, order.pickupLatestTime)
                    },
                    "instructions": order.pickupInstructions
                };

                const delivery = {
                    "contact": {
                        "preferredName": order.consigneePersonName,
                        "fullName": order.consigneePersonName,
                        "phone": order.consigneePhoneNumber == null ? undefined : {
                            "nationalNumber": order.consigneePhoneNumber,
                            "countryCallingCode": "45",
                            "countryCode": "DK"
                        },
                        "email": order.consigneeEmail,
                        "companyName": order.consigneeCompanyName
                    },
                    "location":{
                        "address": {
                            "primary": order.consigneeAddress
                        },
                        "position": order.consigneeAddressPosition,
                        "timeZone": "Europe/Copenhagen"
                    },
                    "appointment":{
                        "from": this.combine(order.deliveryEarliestDate, order.deliveryEarliestTime),
                        "to": this.combine(order.deliveryLatestDate, order.deliveryLatestTime)
                    },
                    "instructions": order.deliveryInstructions
                };

                orderObject["pickup"] = pickup;
                orderObject["delivery"] = delivery;
                orderObject["colli"] = colli;
                orders.push(orderObject);
            }

            body.orders = orders;
            delete body.orderIds;

            body.actionBy = {
                "user": {
                    "id": context.user?.id,
                    "preferredName": context.user?.username,
                    "fullName": context.user?.username,
                    "roleName": context.user?.roleName
                },
                "organization": {
                    "id": context.user?.outfitId,
                    "name": "no-name"
                }
            }

            console.log(body);

            // Sent updated data to NOI
            await this.apiClient.post("logistics-platform/routes/v4/add-orders-to-routes",
            {
                noi: true,
                body: body
            });

            context.response.status = 200;
        });
    }

    /**
     * Combines date and time into one datetime
     */
    private combine(dateString?: string, timeString?: string): DateTime | undefined
    {
        if (dateString == null || timeString == null)
        {
            return undefined;
        }

        const date = DateTime.fromISO(dateString).startOf("day");
        const time = Duration.fromISOTime(timeString);

        return date.plus(time);
    }
}
