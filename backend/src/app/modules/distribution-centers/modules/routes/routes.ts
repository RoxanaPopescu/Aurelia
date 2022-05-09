import { AppContext } from "../../../../app-context";
import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to distribution centers.
 */
export class DistributionCenteRoutesModule extends AppModule
{
    /**
     * Returns a list of routes for a distribution center
     * @returns The list of routes in a distribution center.
     */
    public "GET /v2/distribution-centers/routes/list" = async (context: AppContext) =>
    {
        await context.authorize("view-distribution-centers");

        // Fetch the distribution center
        const dcResult = await this.apiClient.post("logistics/depots/details",
        {
            body:
            {
                id: context.query.distributionCenterId
            }
        });

        const routeResult = await this.apiClient.post("logistics-platform/routes/v2/depotactivity",
        {
            body:
            {
                startTimeFrom: context.query.fromDate,
                startTimeTo: context.query.toDate,
                fulfillerIds: [context.user?.organizationId],
                position: dcResult.data.location.position,
                page: 1,
                pageSize: 1000
            },
            noi: true
        });

        const routes = routeResult.data.routes;
        const routeIds = routes.map((r: any) => r.id);

        if (routeIds.length <= 0)
        {
            context.response.body = [];
            context.response.status = 200;

            return;
        }

        const routeRemarks = await this.apiClient.post("logistics/routeremarks/get",
        {
            body:
            {
                depotId: context.query.distributionCenterId,
                routeIds: routeIds
            }
        });

        const organizations = await this.apiClient.get("organization/organizations",
        {
            query:
            {
                ids: routes.map((r: any) => r.fulfillerId).filter((item: any, i: any, ar: any) => ar.indexOf(item) === i)
            }
        });

        for (const route of routes)
        {
            route.colliTotal = route.totalNumberOfColli;
            delete route.totalNumberOfColli;

            route.remarks = routeRemarks.data.find((r: any) => r.routeId === route.id);
            route.fulfillerName = organizations.data.find((o: any) => o.id === route.fulfillerId)?.name;
        }

        context.response.body = routes;
        context.response.status = 200;
    }

    /**
     * Updates a distribution center
     * @returns 200 OK.
     */
    public "POST /v2/distribution-centers/routes/save-remarks" = async (context: AppContext) =>
    {
        await context.authorize("edit-distribution-centers");

        const body = context.request.body;
        body.createdBy = context.user?.id;

        const result = await this.apiClient.post("logistics/routeremarks/save",
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
    public "GET /v2/distribution-centers/routes/remarks" = async (context: AppContext) =>
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
}
