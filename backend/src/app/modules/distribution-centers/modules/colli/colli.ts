import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to distribution centers.
 */
export class DistributionCenteColliModule extends AppModule
{
    /**
     * Configures the module.
     */
    public configure(): void
    {
        /**
         * Returns a overview of colli for one specific distribution center
         * @returns The overview of colli for a distribution center.
         */
        this.router.get("/v2/distribution-centers/colli/overview", async context =>
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

            const locationId = dcResult.data.location.locationId;
            const result = await this.apiClient.post("logistics/orders/fulfiller/ColliMissingOverview",
            {
                body:
                {
                    outfitIds: [context.user?.organizationId],
                    locations: [locationId],
                    pickupTimeRange: { from: context.query.fromDate, to: context.query.toDate }
                }
            });

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Gets the missing colli for a distribution centers.
         * @returns The list of missing colli distribution centers.
         */
        this.router.get("/v2/distribution-centers/colli/missing", async context =>
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

            const locationId = dcResult.data.location.locationId;
            const result = await this.apiClient.post("logistics/orders/fulfiller/ColliMissingDetails",
            {
                body:
                {
                    outfitIds: [context.user?.organizationId],
                    locations: [locationId],
                    pickupTimeRange: { from: context.query.fromDate, to: context.query.toDate }
                }
            });

            context.response.body = result.data;
            context.response.status = 200;
        });
    }
}
