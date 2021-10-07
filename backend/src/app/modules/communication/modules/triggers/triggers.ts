import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to communication.
 */
export class TriggersModule extends AppModule
{
    public configure(): void
    {
        /**
         * Communication triggers
         * @returns A list of communication triggers
         */
        this.router.get("/v2/communication/triggers", async context =>
        {
            await context.authorize("view-communication");

            const result = await this.apiClient.post("notification/templates/List",
            {
                body:
                {
                    outfitIds: [context.user?.organizationId]
                }
            });

            context.response.body = result.data.results;
            context.response.status = 200;
        });

        /**
         * Details of a trigger
         * @returns A single trigger
         */
        this.router.get("/v2/communication/triggers/:slug", async context =>
        {
            await context.authorize("view-communication");

            const result = await this.apiClient.post("notification/templates/Details",
            {
                body:
                {
                    outfitIds: [context.user?.organizationId],
                    slug: context.params.slug
                }
            });

            context.response.body = result.data;
            context.response.status = 200;
        });
    }
}
