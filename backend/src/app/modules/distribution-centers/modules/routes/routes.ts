import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to distribution centers.
 */
export class DistributionCenteRoutesModule extends AppModule
{
    /**
     * Configures the module.
     */
    public configure(): void
    {
        /**
         * Returns a list of routes for a distribution center
         * @returns The list of routes in a distribution center.
         */
        this.router.get("/v2/distribution-centers/routes/list", async context =>
        {
            await context.authorize("view-depot");

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

            var routes = routeResult.data.routes;
            var routeIds = routes.map((r: any) => r.id);

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

            const organizations = await this.apiClient.get("organizations",
            {
                query:
                {
                    ids: routes.map((r: any) => r.fulfillerId).filter((item: any, i: any, ar: any) => ar.indexOf(item) === i)
                }
            });

            for(const route of routes)
            {
                route.colliTotal = route.totalNumberOfColli;
                delete route.totalNumberOfColli;

                route.remarks = routeRemarks.data.find((r: any) => r.routeId === route.id);
                route.fulfillerName = organizations.data.find((r: any) => r.id === route.fulfillerId);
            }

            context.response.body = routes;
            context.response.status = 200;
        });

        /**
         * Updates a distribution center
         * @returns 200 OK.
         */
        this.router.post("/v2/distribution-centers/update", async context =>
        {
            await context.authorize("edit-depot");

            const body = context.request.body;
            body.createdBy = context.user?.id;

            const result = await this.apiClient.post("logistics/depots/update",
            {
                body: body
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Gets the list of distribution centers.
         * @returns The list of distribution centers.
         */
        this.router.get("/v2/distribution-centers/routes/remarks", async context =>
        {
            await context.authorize("view-depot");

            const result = await this.apiClient.post("logistics/depots/list",
            {
                body:
                {
                    ownerIds: [context.user?.organizationId]
                }
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Gets the distribution center with the specified ID.
         * @param context.params.id The ID of the distribution center to get.
         * @returns The distribution center with the specified ID.
         */
        this.router.get("/v2/distribution-centers/:id", async context =>
        {
            await context.authorize("view-depot");

            const result = await this.apiClient.post("logistics/depots/details",
            {
                body:
                {
                    id: context.params.id
                }
            });

            context.response.body = result.data;
            context.response.status = 200;
        });
    }
}
