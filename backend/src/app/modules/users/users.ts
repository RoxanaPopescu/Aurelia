import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to files.
 */
export class UsersModule extends AppModule
{
    public configure(): void
    {
        /**
         * Uploads a file to the public file storage.
         */
        this.router.post("/v2/users/reactivate", async context =>
        {

            const routesResult = await this.apiClient.post("infrastructure/authentication/reactivateuser",
            {
                body: {
                    ...context.request.body,
                    accessOutfits: [context.user?.outfitId],
                    updatedBy: context.user?.username
                }
            });

            context.response.body = routesResult.data;
            context.response.status = 200;
        });

}
