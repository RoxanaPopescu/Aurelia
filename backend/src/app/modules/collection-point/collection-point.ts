import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to tracking.
 */
export class CollectionPointModule extends AppModule
{
    public configure(): void
    {
        /**
         * Gets the collection point by ID.
         * @param context.params.id The ID of the collection point to receive.
         * @returns The collection point of the specified ID.
         */
        this.router.get("/v2/collection-point/details/:id", async context =>
        {
            const driver = await this.validateDriverLogin(context.request.headers["token"]);

            const result = await this.apiClient.post("collection-point/details",
            {
                body:
                {
                    id: context.params.id,
                    outfitId: driver.outfitId
                }
            });

            context.response.body = result.data;
            context.response.status = 200;
        });
    }

    /**
     * Validates the current driver login with NOI.
     * @param token The login token of the driver.
     * @returns A promise that will be resolved with the details about the driver if valid login.
     */
    private async validateDriverLogin(token: string): Promise<any>
    {
        const result = await this.apiClient.get("logistics-platform/drivers/details-by-token",
        {
            noi: true,
            query: {
                userToken: token
              },
        });

        return result.data;
    }
}
