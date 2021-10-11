import { AppModule } from "../../../../app-module";
import { v4 as uuidV4 } from "uuid";

/**
 * Represents a module exposing endpoints related to tracking.
 */
export class RoutePlanningOrderGroupsModule extends AppModule
{
    public configure(): void
    {
        /**
         * Creates a order-group
         * @returns The created order group.
         */
        this.router.post("/v2/route-planning/order-groups/create", async context =>
        {
            await context.authorize("create-order-group");

            const body = context.request.body;
            body.ownerOutfitId = context.user?.organizationId;
            body.createdBy = context.user?.id;
            body.id = uuidV4();

            await this.apiClient.post("logistics/ordergroups/create",
            {
                body: body
            });

            context.response.body = await this.fetchDetails(body.id, context);
            context.response.status = 200;
        });

        /**
         * Unpause order-group
         * @returns The order group.
         */
         this.router.post("/v2/route-planning/order-groups/unpause", async context =>
         {
             await context.authorize("edit-order-group");

             try {
                const body = context.request.body;
                body.ownerOutfitId = context.user?.organizationId;
                body.modifiedBy = context.user?.id;

                await this.apiClient.post("logistics/ordergroups/activate",
                {
                    body: body
                });

                context.response.body = await this.fetchDetails(body.id, context);
                context.response.status = 200;
             } catch (error: any)
             {
                 console.log(error.data);
             }
         });

        /**
         * Pauses order-group
         * @returns The order group.
         */
        this.router.post("/v2/route-planning/order-groups/pause", async context =>
        {
            await context.authorize("edit-order-group");

            const body = context.request.body;
            body.ownerOutfitId = context.user?.organizationId;
            body.modifiedBy = context.user?.id;

            await this.apiClient.post("logistics/ordergroups/pause",
            {
                body: body
            });

            context.response.body = await this.fetchDetails(body.id, context);

            context.response.status = 200;
        });

        /**
         * Creates a order-group
         * @returns The created order group.
         */
        this.router.get("/v2/route-planning/order-groups/:id", async context =>
        {
            await context.authorize("view-order-groups");

            context.response.body = await this.fetchDetails(context.params.id, context);
            context.response.status = 200;
        });

        /**
         * Gets the order groups
         * @returns The list of ordergroups.
         */
        this.router.post("/v2/route-planning/order-groups/list", async context =>
        {
            await context.authorize("view-order-groups");

            const body = context.request.body;
            body.outfitIds = [context.user?.organizationId];
            body.ownerOutfitId = context.user?.organizationId;

            const result = await this.apiClient.post("logistics/ordergroups/list",
            {
                body: body
            });

            const orderGroups = result.data;
            let organizationIds: string[] = [];

            orderGroups.forEach((g: any) =>
            {
                g.matchingCriteria.forEach((m: any) =>
                {
                    organizationIds.push(...m.consignorIds);
                });
            });

            // Unique ids
            organizationIds = [...new Set(organizationIds)];
            const organizations = await this.fetchOrganizations(organizationIds);

            // Remap organizations
            orderGroups.forEach((g: any) =>
            {
                g.matchingCriteria.forEach((m: any) =>
                {
                    m.organizations = organizations.filter(o => m.consignorIds.includes(o.id));
                    delete m.consignorIds;
                });

                g.etag = g.eTag;
                delete g.eTag;

                g.paused = g.status.name.toLowerCase() === "paused";
                delete g.status;
            });

            context.response.body = result.data;
            context.response.status = 200;
        });
    }

    private async fetchOrganizations(ids: string[]): Promise<any[]>
    {
        const organizations: any[] = [];

        try
        {
            // FIXME:
            ids.push("bf6d4bf2-49a2-44e7-9c49-489405c5776d");

            const legacyConsignorsRequest = this.apiClient.post("logistics/outfits/consignor/list",
            {
                body: {
                    ids: ids
                }
            });

            /*
            const organizationsRequest = this.apiClient.get("organization/organizations",
            {
                query:
                {
                    ids: ids
                }
            });
            */

            const [result1] = await Promise.all([legacyConsignorsRequest]);

            // console.log("d2", result2.data);
            organizations.push(...result1.data.results);
        }
        catch (error: any)
        {
            console.log(error.data.errors);
            // We should not fail if organizations can't be found
        }

        return organizations;
    }

    private async fetchDetails(id: string, context: any): Promise<any>
    {
        const result = await this.apiClient.post("logistics/ordergroups/details",
        {
            body:
            {
                ownerOutfitId: context.user?.organizationId,
                id: id
            }
        });

        const orderGroup = result.data;
        const organizationIds: string[] = [];

        orderGroup.matchingCriteria.forEach((m: any) =>
        {
            organizationIds.push(...m.consignorIds);
        });

        const organizations = await this.fetchOrganizations(organizationIds);

        orderGroup.matchingCriteria.forEach((m: any) =>
        {
            m.organizations = organizations.filter(o => m.consignorIds.includes(o.id));
            delete m.consignorIds;
        });

        orderGroup.paused = orderGroup.status.name.toLowerCase() === "paused";
        delete orderGroup.status;

        orderGroup.etag = orderGroup.eTag;
        delete orderGroup.eTag;

        return result.data;
    }
}
