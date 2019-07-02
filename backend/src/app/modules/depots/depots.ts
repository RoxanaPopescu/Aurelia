import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to depots.
 */
export class DepotsModule extends AppModule
{
    public configure(): void
    {
        /**
         * Gets the depot with the specified ID.
         * @param context.params.id The ID of the depot to get.
         * @returns The depot with the specified ID.
         */
        this.router.get("/depots/:id", async context =>
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
