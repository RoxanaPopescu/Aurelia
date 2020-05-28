import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to depots.
 */
export class DepotsModule extends AppModule
{
    /**
     * Configures the module.
     */
    public configure(): void
    {
        /**
         * Gets the list of depots.
         * @returns The list of depots.
         */
        this.router.post("/v2/distribution-center/list", async context =>
        {
            context.authorize("view-depots");
            const result = await this.apiClient.post("depots/list");

            context.response.body = result.data;
            context.response.status = 200;
        });

        /**
         * Gets the distribution center with the specified ID.
         * @param context.params.id The ID of the depot to get.
         * @returns The distribution center with the specified ID.
         */
        this.router.get("/v2/distribution-center/details/:id", async context =>
        {
            context.authorize("view-depots");

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
