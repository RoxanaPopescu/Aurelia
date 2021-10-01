import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to files.
 */
export class UsersModule extends AppModule
{
    public configure(): void
    {
        /**
         * Reactivates a user.
         */
        this.router.post("/v2/users/reactivate", async context =>
        {
            await context.authorize("create-user");

            const routesResult = await this.apiClient.post("infrastructure/authentication/reactivateuser",
            {
                body: {
                    ...context.request.body,
                    accessOutfits: [context.user?.organizationId],
                    updatedBy: context.user?.email
                }
            });

            context.response.body = routesResult.data;
            context.response.status = 200;
        });
    }
}
