import { AppModule } from "../../app-module";
import { AppContext } from "../../app-context";

/**
 * Represents a module exposing endpoints related to organizations.
 */
export class OrganizationModule extends AppModule
{
    /**
     * Creates a new organization.
     */
    public "POST /v2/organizations/create" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.post("organization/organizations/create",
        {
            body:
            {
                organizationType: context.request.body.type,
                name: context.request.body.name,
                initialOwnerUserId: context.user!.id
            }
        });

        context.response.body = { id: result.data.organizationId, name: context.request.body.name };
        context.response.status = 200;
    }

    /**
     * Gets all organizations visible to the current user.
     */
    public "GET /v2/organizations" = async (context: AppContext) =>
    {
        await context.authorize();

        const result1 = await this.apiClient.get(`identity/memberships/users/${context.user!.id}`);

        const organizations = await Promise.all(result1.data.organizationMemberships.map(async (membership: any) =>
        {
            const result2 = await this.apiClient.get(`organization/organizations/${membership.organizationId}`);

            return result2.data;
        }));

        // TODO: We could consider adding invitations here, as they are already in the response.

        context.response.body = organizations;
        context.response.status = 200;
    }

    /**
     * Gets the specified organization.
     */
    public "GET /v2/organizations/:id" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.get(`organization/organizations/${context.params.id}`);

        context.response.body = result.data;
        context.response.status = 200;
    }
}
