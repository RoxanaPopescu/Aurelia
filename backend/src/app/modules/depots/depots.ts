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
        this.router.post("/v2/depots/list", async context =>
        {
            context.authorize("view-depots");

            const depotsResult = await this.apiClient.post("depots/list");

            context.response.body = depotsResult.data;
            context.response.status = 200;
        });

        /**
         * Gets the depot with the specified ID.
         * @param context.params.id The ID of the depot to get.
         * @returns The depot with the specified ID.
         */
        this.router.get("/v2/depots/details/:id", async context =>
        {
            context.authorize("view-depots");

            const depotResult = await this.apiClient.post("depots/details",
            {
                body:
                {
                    id: context.params.id
                }
            });

            context.response.body = depotResult.data;
            context.response.status = 200;
        });
    }
}
