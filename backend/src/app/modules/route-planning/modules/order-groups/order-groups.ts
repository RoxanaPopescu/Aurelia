import { v4 as uuidV4 } from "uuid";
import { AppContext } from "../../../../app-context";
import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to tracking.
 */
export class RoutePlanningOrderGroupsModule extends AppModule
{
    /**
     * Creates a order-group
     * @returns The created order group.
     */
    public "POST /v2/route-planning/order-groups/create" = async (context: AppContext) =>
    {
        await context.authorize("create-order-groups");

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
    }

    /**
     * Updates a order-group
     * @returns The updated order group.
     */
    public "POST /v2/route-planning/order-groups/update" = async (context: AppContext) =>
    {
        await context.authorize("edit-order-groups");

        const body = context.request.body;
        body.ownerOutfitId = context.user?.organizationId;
        body.modifiedBy = context.user?.id;

        await this.apiClient.post("logistics/ordergroups/update",
        {
            body: body
        });

        context.response.body = await this.fetchDetails(body.id, context);
        context.response.status = 200;
    }

    /**
     * Updates a order-group
     * @returns The updated order group.
     */
    public "POST /v2/route-planning/order-groups/delete" = async (context: AppContext) =>
    {
        await context.authorize("edit-order-groups");

        const body = context.request.body;
        body.ownerOutfitId = context.user?.organizationId;
        body.modifiedBy = context.user?.id;

        const result = await this.apiClient.post("logistics/ordergroups/delete",
        {
            body: body
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Unpause order-group
     * @returns The order group.
     */
    public "POST /v2/route-planning/order-groups/unpause" = async (context: AppContext) =>
    {
        await context.authorize("edit-order-groups");

        const body = context.request.body;
        body.ownerOutfitId = context.user?.organizationId;
        body.modifiedBy = context.user?.id;

        await this.apiClient.post("logistics/ordergroups/activate",
        {
            body: body
        });

        context.response.body = await this.fetchDetails(body.id, context);
        context.response.status = 200;
    }

    /**
     * Pauses order-group
     * @returns The order group.
     */
    public "POST /v2/route-planning/order-groups/pause" = async (context: AppContext) =>
    {
        await context.authorize("edit-order-groups");

        const body = context.request.body;
        body.ownerOutfitId = context.user?.organizationId;
        body.modifiedBy = context.user?.id;

        await this.apiClient.post("logistics/ordergroups/pause",
        {
            body: body
        });

        context.response.body = await this.fetchDetails(body.id, context);

        context.response.status = 200;
    }

    /**
     * Unlocks order-group
     * @returns The order group.
     */
    public "POST /v2/route-planning/order-groups/unlock" = async (context: AppContext) =>
    {
        await context.authorize("edit-order-groups");

        const body = context.request.body;
        body.ownerOutfitId = context.user?.organizationId;
        body.modifiedBy = context.user?.id;

        await this.apiClient.post("logistics/ordergroups/unlock",
        {
            body: body
        });

        context.response.body = await this.fetchDetails(body.id, context);

        context.response.status = 200;
    }

    /**
     * Creates a order-group
     * @returns The created order group.
     */
    public "GET /v2/route-planning/order-groups/:id" = async (context: AppContext) =>
    {
        await context.authorize("view-order-groups");

        context.response.body = await this.fetchDetails(context.params.id, context);
        context.response.status = 200;
    }

    /**
     * Gets the order groups
     * @returns The list of ordergroups.
     */
    public "POST /v2/route-planning/order-groups/list" = async (context: AppContext) =>
    {
        await context.authorize("view-order-groups");

        const body = context.request.body;
        body.outfitIds = [context.user?.organizationId];
        body.ownerOutfitId = context.user?.organizationId;

        const result = await this.apiClient.post("logistics/ordergroups/list",
        {
            body: body
        });

        let orderGroups = result.data;
        let organizationIds: string[] = [];

        orderGroups = orderGroups.filter((o: any) => o.status.name.toLowerCase() !== "deleted");

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

        context.response.body = orderGroups;
        context.response.status = 200;
    }

    private async fetchOrganizations(ids: string[]): Promise<any[]>
    {
        const organizations: any[] = [];

        if (ids.length === 0)
        {
            return [];
        }

        try
        {
            const organizationsRequest = this.apiClient.get("organization/organizations",
            {
                query:
                {
                    ids: ids
                }
            });

            const legacyConsignorsRequest = this.apiClient.post("logistics/outfits/consignor/list",
            {
                body: {
                    ids: ids
                }
            });

            const [result1, result2] = await Promise.all([organizationsRequest, legacyConsignorsRequest]);

            for (const organization of [...result1.data.map((o: any) => ({ id: o.id, companyName: o.name })), ...result2.data.results])
            {
                if (!organizations.some(o => o.id === organization.id))
                {
                    organizations.push(organization);
                }
            }
        }
        catch (error: any)
        {
            // BUG: Pretty sure this doesn't work as intended

            console.log(error.data?.errors);
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
