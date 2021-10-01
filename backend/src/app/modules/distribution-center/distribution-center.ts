import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to distribution centers.
 */
export class DistributionCenterModule extends AppModule
{
    /**
     * Configures the module.
     */
    public configure(): void
    {
        /**
         * Gets the list of distribution centers.
         * @returns The list of distribution centers.
         */
        this.router.post("/v2/distribution-center/list", async context =>
        {
            await context.authorize("view-depots");

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
        this.router.get("/v2/distribution-center/details/:id", async context =>
        {
            await context.authorize("view-depots");

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
