import { AppContext } from "../../app-context";
import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to files.
 */
export class UsersModule extends AppModule
{
    /**
     * Reactivates a user.
     */
    public "POST /v2/users/reactivate" = async (context: AppContext) =>
    {
        await context.authorize("create-users");

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
    }
}
