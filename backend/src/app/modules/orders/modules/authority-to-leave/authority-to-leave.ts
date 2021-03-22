import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to granting and revoking authority to leave.
 */
export class AuthorityToLeaveModule extends AppModule
{
    public configure(): void
    {
        /**
         * Grants authority to leave for the specified order.
         * @param context.request.body.ownerId The ID of the owner of the order.
         * @param context.request.body.ownerOrderId The ID of the order for which to get events.
         * @param context.request.body.deliveryInstructions The delivery instructions.
         */
        this.router.post("/v2/orders/authority-to-leave/grant", async context =>
        {
            await this.apiClient.post("Orders/GrantAuthorityToLeave",
            {
                body:
                {
                    ...context.request.body,
                    actionBy:
                    {
                        organization:
                        {
                            id: context.request.body.ownerId,
                            name: "(Tracking user)"
                        }
                    }
                }
            });

            // Set the response status.
            context.response.status = 204;
        });

        /**
         * Grants authority to leave for the specified order.
         * @param context.request.body.ownerId The ID of the owner of the order.
         * @param context.request.body.ownerOrderId The ID of the order for which to get events.
         */
        this.router.post("/v2/orders/authority-to-leave/revoke", async context =>
        {
            await this.apiClient.post("Orders/RevokeAuthorityToLeave",
            {
                body:
                {
                    ...context.request.body,
                    actionBy:
                    {
                        organization:
                        {
                            id: context.request.body.ownerId,
                            name: "(Tracking user)"
                        }
                    }
                }
            });

            // Set the response status.
            context.response.status = 204;
        });
    }
}
