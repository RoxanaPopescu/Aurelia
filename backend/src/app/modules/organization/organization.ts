import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to organizations.
 */
export class OrganizationModule extends AppModule
{
    public configure(): void
    {
        /**
         * Creates a new organization.
         */
        this.router.post("/v2/organizations/create", async context =>
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
        });

        /**
         * Gets all organizations visible to the current user.
         */
        this.router.get("/v2/organizations", async context =>
        {
            await context.authorize();

            const result1 = await this.apiClient.get("identity/memberships",
            {
                query:
                {
                    userId: context.user!.id
                }
            });

            const organizations = await Promise.all(result1.data.map(async (membership: any) =>
            {
                const result2 = await this.apiClient.get(`organization/organizations/${membership.organizationId}`);

                return result2.data;
            }));

            context.response.body = organizations;
            context.response.status = 200;
        });

        /**
         * Gets the specified organization.
         */
        this.router.get("/v2/organizations/:id", async context =>
        {
            await context.authorize();

            const result = await this.apiClient.get(`organization/organizations/${context.params.id}`);

            context.response.body = result.data;
            context.response.status = 200;
        });
    }
}
